import "./bootstrap";

// console.log("connected to app.js");

let todos;
let filters = [true, false, false]; // all, active, completed

// auto loads
document.addEventListener("DOMContentLoaded", handleFetch);
const toggleDarkModeButton = document.getElementById("darkModeButton");
const moonIcon = document.querySelector(".moon");
const sunIcon = document.querySelector(".sun");
if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
    document.documentElement.classList.add("dark");
    localStorage.theme = "dark";

    moonIcon.classList.add("hidden");
    sunIcon.classList.remove("hidden");
} else {
    localStorage.theme = "light";
    document.documentElement.classList.remove("dark");
    moonIcon.classList.remove("hidden");
    sunIcon.classList.add("hidden");
}

toggleDarkModeButton.addEventListener("click", (e) => handleDarkMode(e));

const forms = document.querySelectorAll("form");
forms.forEach((item) => {
    item.addEventListener("submit", (e) => handleSubmit(e));
});

const filtersButtons = document
    .getElementById("todo_filter")
    .querySelectorAll("button");
if (filtersButtons) {
    filtersButtons.forEach((item, index) => {
        item.addEventListener("click", (e) => renderByFilter(e, index));
    });
}

const filtersButtonsMD = document
    .getElementById("todo_list_footer")
    .querySelectorAll("button[type='button']");
if (filtersButtonsMD) {
    filtersButtonsMD.forEach((item, index) => {
        item.addEventListener("click", (e) => renderByFilter(e, index));
    });
}

function handleFetch() {
    fetch("/todos")
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            if (data.length === 0) {
                return;
            }
            const activeTodoFilter = data.filter((item) => {
                return item.active === true;
            });

            const itemsLeft = document.getElementById("items_left");
            if (itemsLeft) {
                itemsLeft.textContent = activeTodoFilter.length;
            }
            todos = data;
        })
        .catch((error) => {
            // console.log(error);
        });
}

function showOrHidden() {
    if (todos.length > 0) {
        document.getElementById("todo_list_footer").classList.remove("hidden");
        document.getElementById("todo_filter").classList.remove("hidden");
        document.getElementById("todo_reorder").classList.remove("hidden");

        document.getElementById("todo_list_footer").classList.add("flex");
        document
            .getElementById("todo_filter")
            .classList.add("flex", "md:hidden");
        document.getElementById("todo_reorder").classList.add("flex");
    } else {
        document.getElementById("todo_list_footer").classList.add("hidden");
        document.getElementById("todo_filter").classList.add("hidden");
        document.getElementById("todo_reorder").classList.add("hidden");

        document.getElementById("todo_list_footer").classList.remove("flex");
        document.getElementById("todo_filter").classList.remove("flex");
        document.getElementById("todo_reorder").classList.remove("flex");
    }
}

function handleSubmit(e) {
    e.preventDefault();

    const currentForm = e.currentTarget;
    const submit = e.currentTarget.querySelector("button[type='submit']");

    // create todo
    if (submit.dataset.todo) {
        const form = new FormData(e.currentTarget);

        fetch(e.currentTarget.action, {
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
            },
            method: "post",
            body: JSON.stringify({
                name: form.get("name").trim(),
            }),
        })
            .then((response) => {
                if (response.ok === true) {
                    return response.json();
                }
            })
            .then((data) => {
                if (filtersButtons) {
                    filtersButtons.forEach((item) => {
                        item.classList.remove("active");
                    });
                }
                if (filtersButtonsMD) {
                    filtersButtonsMD.forEach((item) => {
                        item.classList.remove("active");
                    });
                }

                filtersButtons[0].classList.add("active");
                filtersButtonsMD[0].classList.add("active");

                if (data[1].length === 0) {
                    return;
                }

                const todoListContainer = document.getElementById("todo_list");

                // refresh
                while (todoListContainer.firstChild) {
                    todoListContainer.removeChild(todoListContainer.firstChild);
                }

                const fragment = document.createDocumentFragment();
                data[1].forEach((item) => {
                    if (item.active) {
                        const newTodotemplate =
                            document.getElementById("newTodoTemplate");
                        const newTodoTemplateClone =
                            newTodotemplate.content.cloneNode(true);

                        // config
                        const divTodo =
                            newTodoTemplateClone.querySelector("div");
                        divTodo.id = `todo${item.id}`;

                        const forms = divTodo.querySelectorAll("form");

                        const updateTodoForm =
                            (forms[0].id = `update_todo_form${item.id}`);
                        forms[0].addEventListener("submit", (e) =>
                            handleSubmit(e)
                        );

                        const updateTodoButton = (forms[0].querySelector(
                            "button[type='submit']"
                        ).dataset.update = item.id);

                        const deleteTodoForm =
                            (forms[1].id = `delete_todo_form ${item.id}`);

                        forms[1].addEventListener("submit", (e) =>
                            handleSubmit(e)
                        );
                        const deleteTodoButton = (forms[1].querySelector(
                            "button[type='submit']"
                        ).dataset.delete = item.id);

                        const textTodo = (divTodo.querySelector(
                            "p"
                        ).textContent = item.name);

                        fragment.appendChild(newTodoTemplateClone);
                    } else if (item.completed) {
                        const updateTodoTemplate =
                            document.getElementById("updateTodoTemplate");
                        const updateTodoTemplateClone =
                            updateTodoTemplate.content.cloneNode(true);

                        // config
                        const divTodo =
                            updateTodoTemplateClone.querySelector("div");
                        divTodo.id = `todo${item.id}`;

                        const deleteForm = divTodo.querySelector("form");

                        const deleteTodoForm =
                            (deleteForm.id = `delete_todo_form ${item.id}`);

                        deleteForm.addEventListener("submit", (e) =>
                            handleSubmit(e)
                        );

                        const deleteTodoButton = (deleteForm.querySelector(
                            "button[type='submit']"
                        ).dataset.delete = item.id);

                        const textTodo = (divTodo.querySelector(
                            "p"
                        ).textContent = item.name);

                        fragment.appendChild(updateTodoTemplateClone);
                    }
                });

                todoListContainer.appendChild(fragment);

                todos = data[1];

                const activeTodoFilter = todos.filter((item) => {
                    return item.active === true;
                });

                const itemsLeft = document.getElementById("items_left");
                if (itemsLeft) {
                    itemsLeft.textContent = activeTodoFilter.length;
                }

                document
                    .getElementById("todo_list_footer")
                    .classList.remove("rounded-tl-lg", "rounded-tr-lg");

                showOrHidden();

                // resets
                handleFetch();

                currentForm.reset();
            })
            .catch((error) => {
                // console.log(error);
            });
    }

    // update todo
    if (submit.dataset.update) {
        const id = parseInt(submit.dataset.update);
        fetch(e.currentTarget.action, {
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
            },
            method: "post",
            body: JSON.stringify({
                id: id,
            }),
        })
            .then((response) => {
                if (response.ok === true) {
                    return response.json();
                }
            })
            .then((data) => {
                const previousId = `todo${data[0].id}`;
                const previousTodo = document.getElementById(previousId);

                const containerTodoList = document.getElementById("todo_list");
                const updateTodoTemplate =
                    document.getElementById("updateTodoTemplate");
                const updateTodoTemplateClone =
                    updateTodoTemplate.content.cloneNode(true);

                // config
                const divTodo = updateTodoTemplateClone.querySelector("div");
                divTodo.id = `todo${data[0].id}`;

                const deleteForm = divTodo.querySelector("form");

                const deleteTodoForm =
                    (deleteForm.id = `delete_todo_form ${data[0].id}`);

                deleteForm.addEventListener("submit", (e) => handleSubmit(e));

                const deleteTodoButton = (deleteForm.querySelector(
                    "button[type='submit']"
                ).dataset.delete = data[0].id);

                const textTodo = (divTodo.querySelector("p").textContent =
                    data[0].name);

                containerTodoList.replaceChild(
                    updateTodoTemplateClone,
                    previousTodo
                );

                todos = data[1];

                showOrHidden();
                // resets
                handleFetch();
            })
            .catch((error) => {
                // console.log(error);
            });
    }

    //delete todo
    if (submit.dataset.delete) {
        const id = parseInt(submit.dataset.delete);

        const completedTodoFilter = todos.filter((item) => {
            return item.completed === true;
        });

        if (filters[2] === true && completedTodoFilter.length === 0) {
            document
                .getElementById("todo_list_footer")
                .classList.add("rounded-tl-lg", "rounded-tr-lg");
        } else {
            handleFetch();
        }

        fetch(e.currentTarget.action, {
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
            },
            method: "post",
            body: JSON.stringify({
                id: id,
            }),
        })
            .then((response) => {
                if (response.ok === true) {
                    return response.json();
                }
            })
            .then((data) => {
                const todoId = `todo${data[0]}`;
                const divTodo = document.getElementById(todoId);

                divTodo.remove();

                todos = data[1];

                showOrHidden();
                // resets
                handleFetch();
            })
            .catch((error) => {
                // console.log(error);
            });
    }

    // clear completed
    if (submit.dataset.delete_completed === "clear") {
        todos.forEach((item) => {
            if (item.completed === true) {
                const previousId = `todo${item.id}`;
                const previousTodo = document.getElementById(previousId);
                if (previousTodo) {
                    previousTodo.remove();
                }
            }
        });

        if (filters[2] === true) {
            document
                .getElementById("todo_list_footer")
                .classList.add("rounded-tl-lg", "rounded-tr-lg");
        } else {
            handleFetch();
        }

        fetch(e.currentTarget.action, {
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
            },
            method: "post",
        })
            .then((response) => {
                if (response.ok === true) {
                    return response.json();
                }
            })
            .then((data) => {
                todos = data[1];

                showOrHidden();
            })
            .catch((error) => {
                // console.log(error);
            });
    }
}

function handleDarkMode(e) {
    if (localStorage.theme === "dark") {
        localStorage.theme = "light";
        document.documentElement.classList.remove("dark");
        moonIcon.classList.remove("hidden");
        sunIcon.classList.add("hidden");
    } else {
        document.documentElement.classList.add("dark");
        localStorage.theme = "dark";

        moonIcon.classList.add("hidden");
        sunIcon.classList.remove("hidden");
    }
}

function renderByFilter(e, index) {
    if (filtersButtons) {
        filtersButtons.forEach((item) => {
            item.classList.remove("active");
        });
    }
    if (filtersButtonsMD) {
        filtersButtonsMD.forEach((item) => {
            item.classList.remove("active");
        });
    }

    // filter by All
    if (index === 0) {
        filters[0] = true;
        filters[1] = false;
        filters[2] = false;

        filtersButtons[0].classList.add("active");
        filtersButtonsMD[0].classList.add("active");

        // new todo list

        if (todos.length === 0) {
            return;
        }

        const todoListContainer = document.getElementById("todo_list");

        // refresh
        while (todoListContainer.firstChild) {
            todoListContainer.removeChild(todoListContainer.firstChild);
        }

        const fragment = document.createDocumentFragment();
        todos.forEach((item) => {
            if (item.active) {
                const newTodotemplate =
                    document.getElementById("newTodoTemplate");
                const newTodoTemplateClone =
                    newTodotemplate.content.cloneNode(true);

                // config
                const divTodo = newTodoTemplateClone.querySelector("div");
                divTodo.id = `todo${item.id}`;

                const forms = divTodo.querySelectorAll("form");

                const updateTodoForm =
                    (forms[0].id = `update_todo_form${item.id}`);
                forms[0].addEventListener("submit", (e) => handleSubmit(e));

                const updateTodoButton = (forms[0].querySelector(
                    "button[type='submit']"
                ).dataset.update = item.id);

                const deleteTodoForm =
                    (forms[1].id = `delete_todo_form ${item.id}`);

                forms[1].addEventListener("submit", (e) => handleSubmit(e));
                const deleteTodoButton = (forms[1].querySelector(
                    "button[type='submit']"
                ).dataset.delete = item.id);

                const textTodo = (divTodo.querySelector("p").textContent =
                    item.name);

                fragment.appendChild(newTodoTemplateClone);
            } else if (item.completed) {
                const updateTodoTemplate =
                    document.getElementById("updateTodoTemplate");
                const updateTodoTemplateClone =
                    updateTodoTemplate.content.cloneNode(true);

                // config
                const divTodo = updateTodoTemplateClone.querySelector("div");
                divTodo.id = `todo${item.id}`;

                const deleteForm = divTodo.querySelector("form");

                const deleteTodoForm =
                    (deleteForm.id = `delete_todo_form ${item.id}`);

                deleteForm.addEventListener("submit", (e) => handleSubmit(e));

                const deleteTodoButton = (deleteForm.querySelector(
                    "button[type='submit']"
                ).dataset.delete = item.id);

                const textTodo = (divTodo.querySelector("p").textContent =
                    item.name);

                fragment.appendChild(updateTodoTemplateClone);
            }
        });

        todoListContainer.appendChild(fragment);

        const activeTodoFilter = todos.filter((item) => {
            return item.active === true;
        });

        const itemsLeft = document.getElementById("items_left");
        if (itemsLeft) {
            itemsLeft.textContent = activeTodoFilter.length;
        }

        document
            .getElementById("todo_list_footer")
            .classList.remove("rounded-tl-lg", "rounded-tr-lg");
    }

    // filter by Active
    if (index === 1) {
        filters[0] = false;
        filters[1] = true;
        filters[2] = false;
        filtersButtons[1].classList.add("active");
        filtersButtonsMD[1].classList.add("active");
        // new todo list

        if (todos.length === 0) {
            return;
        }

        const todoListContainer = document.getElementById("todo_list");

        // refresh
        while (todoListContainer.firstChild) {
            todoListContainer.removeChild(todoListContainer.firstChild);
        }

        const fragment = document.createDocumentFragment();
        todos.forEach((item) => {
            if (item.active) {
                const newTodotemplate =
                    document.getElementById("newTodoTemplate");
                const newTodoTemplateClone =
                    newTodotemplate.content.cloneNode(true);

                // config
                const divTodo = newTodoTemplateClone.querySelector("div");
                divTodo.id = `todo${item.id}`;

                const forms = divTodo.querySelectorAll("form");

                const updateTodoForm =
                    (forms[0].id = `update_todo_form${item.id}`);
                forms[0].addEventListener("submit", (e) => handleSubmit(e));

                const updateTodoButton = (forms[0].querySelector(
                    "button[type='submit']"
                ).dataset.update = item.id);

                const deleteTodoForm =
                    (forms[1].id = `delete_todo_form ${item.id}`);

                forms[1].addEventListener("submit", (e) => handleSubmit(e));
                const deleteTodoButton = (forms[1].querySelector(
                    "button[type='submit']"
                ).dataset.delete = item.id);

                const textTodo = (divTodo.querySelector("p").textContent =
                    item.name);

                fragment.appendChild(newTodoTemplateClone);
            }
        });

        todoListContainer.appendChild(fragment);

        const activeTodoFilter = todos.filter((item) => {
            return item.active === true;
        });

        const itemsLeft = document.getElementById("items_left");
        if (itemsLeft) {
            itemsLeft.textContent = activeTodoFilter.length;
        }

        if (activeTodoFilter.length == 0) {
            document
                .getElementById("todo_list_footer")
                .classList.add("rounded-tl-lg", "rounded-tr-lg");
        } else {
            document
                .getElementById("todo_list_footer")
                .classList.remove("rounded-tl-lg", "rounded-tr-lg");
        }
    }

    // filter by Completed
    if (index === 2) {
        filters[0] = false;
        filters[1] = false;
        filters[2] = true;

        filtersButtons[2].classList.add("active");
        filtersButtonsMD[2].classList.add("active");
        // new todo list

        if (todos.length === 0) {
            return;
        }

        const todoListContainer = document.getElementById("todo_list");

        // refresh
        while (todoListContainer.firstChild) {
            todoListContainer.removeChild(todoListContainer.firstChild);
        }

        const fragment = document.createDocumentFragment();
        todos.forEach((item) => {
            if (item.completed) {
                const updateTodoTemplate =
                    document.getElementById("updateTodoTemplate");
                const updateTodoTemplateClone =
                    updateTodoTemplate.content.cloneNode(true);

                // config
                const divTodo = updateTodoTemplateClone.querySelector("div");
                divTodo.id = `todo${item.id}`;

                const deleteForm = divTodo.querySelector("form");

                const deleteTodoForm =
                    (deleteForm.id = `delete_todo_form ${item.id}`);

                deleteForm.addEventListener("submit", (e) => handleSubmit(e));

                const deleteTodoButton = (deleteForm.querySelector(
                    "button[type='submit']"
                ).dataset.delete = item.id);

                const textTodo = (divTodo.querySelector("p").textContent =
                    item.name);

                fragment.appendChild(updateTodoTemplateClone);
            }
        });

        todoListContainer.appendChild(fragment);

        const activeTodoFilter = todos.filter((item) => {
            return item.active === true;
        });

        const completedTodoFilter = todos.filter((item) => {
            return item.completed === true;
        });

        const itemsLeft = document.getElementById("items_left");
        if (itemsLeft) {
            itemsLeft.textContent = activeTodoFilter.length;
        }

        if (completedTodoFilter.length == 0) {
            document
                .getElementById("todo_list_footer")
                .classList.add("rounded-tl-lg", "rounded-tr-lg");
        } else {
            document
                .getElementById("todo_list_footer")
                .classList.remove("rounded-tl-lg", "rounded-tr-lg");
        }
    }
}
