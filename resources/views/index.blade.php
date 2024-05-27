<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap"
        rel="stylesheet">
    <title>Todo App</title>
    @vite('resources/css/app.css')
</head>

<body class="font-JosefinSans">
    <div class="min-h-screen bg-[#FAFAFA] flex flex-col mx-auto dark:bg-[#171823]">

        <header
            class="relative h-[200px] bg-mobile-light md:bg-desktop-light md:h-[300px] dark:bg-mobile-dark dark:md:bg-desktop-dark ">
            <div class="flex items-center justify-between max-w-[540px] min-[540px]:px-0 container mx-auto p-6">
                <a class="text-2xl text-white font-bold tracking-[6px]" href="{{ route('index') }}">
                    TODO
                </a>
                <button id="darkModeButton" type="button">
                    <figure class="moon hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26">
                            <path fill="#FFF" fill-rule="evenodd"
                                d="M13 0c.81 0 1.603.074 2.373.216C10.593 1.199 7 5.43 7 10.5 7 16.299 11.701 21 17.5 21c2.996 0 5.7-1.255 7.613-3.268C23.22 22.572 18.51 26 13 26 5.82 26 0 20.18 0 13S5.82 0 13 0z" />
                        </svg>
                    </figure>
                    <figure class="sun hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26">
                            <path fill="#FFF" fill-rule="evenodd"
                                d="M13 21a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-5.657-2.343a1 1 0 010 1.414l-2.121 2.121a1 1 0 01-1.414-1.414l2.12-2.121a1 1 0 011.415 0zm12.728 0l2.121 2.121a1 1 0 01-1.414 1.414l-2.121-2.12a1 1 0 011.414-1.415zM13 8a5 5 0 110 10 5 5 0 010-10zm12 4a1 1 0 110 2h-3a1 1 0 110-2h3zM4 12a1 1 0 110 2H1a1 1 0 110-2h3zm18.192-8.192a1 1 0 010 1.414l-2.12 2.121a1 1 0 01-1.415-1.414l2.121-2.121a1 1 0 011.414 0zm-16.97 0l2.121 2.12A1 1 0 015.93 7.344L3.808 5.222a1 1 0 011.414-1.414zM13 0a1 1 0 011 1v3a1 1 0 11-2 0V1a1 1 0 011-1z" />
                        </svg>
                    </figure>
                </button>
            </div>
        </header>
        <main class=" flex flex-col -mt-28  relative z-10 px-6 md:-mt-40">
            <form id="create_todo_form"
                class="container max-w-[540px] mx-auto px-6 rounded-lg  bg-white dark:bg-[#25273D]"
                action="{{ route('index.create') }}" method="post">
                @csrf
                @method('POST')
                <div class="flex items-center gap-6">
                    <button
                        class="min-h-[25px] min-w-[25px] relative z-10 flex items-center justify-center rounded-full border border-black/10 hover:border-transparent hover:after:content-[''] hover:after:absolute hover:after:top-[1px] hover:after:left-[1px] hover:after:bottom-[1px] hover:after:right-[1px]  hover:bg-gradient-to-br hover:from-[#55DDFF] hover:to-[#C058F3] hover:border-none hover:after:bg-white hover:after:block hover:after:rounded-full hover:after:z-20 dark:border-[#393A4B]  dark:hover:after:bg-[#25273D]"
                        type="submit" data-todo="create_todo">

                    </button>

                    <input
                        class="w-full bg-white text-left text-[12px] py-6 outline-none text-[#393A4B] placeholder:text-[#393A4B] dark:bg-[#25273D] dark:text-[#C8CBE7] dark:placeholder:text-[#C8CBE7]"
                        type="text" name="name" placeholder="Create a new todo...">

                </div>
            </form>

            <section id="todo_list"
                class="container mx-auto max-w-[540px] max-h-[450px] overflow-y-auto bg-white mt-6 rounded-tl-lg  rounded-tr-lg dark:bg-[#25273D]">

                @if (isset($todos) && count($todos) > 0)
                    @foreach ($todos as $todo)
                        @if ($todo->active)
                            <div id="todo{{ $todo->id }}"
                                class="flex items-baseline gap-6 p-6 todo-row dark:todo-row-dark">
                                <form id="update_todo_form{{ $todo->id }}" action="{{ route('index.update') }}"
                                    method="post">
                                    @csrf
                                    @method('PUT')
                                    <button
                                        class="min-h-[25px] min-w-[25px] text-transparent group relative z-10 flex items-center justify-center rounded-full border border-black/10 hover:border-transparent hover:after:content-[''] hover:after:absolute hover:after:top-[1px] hover:after:left-[1px] hover:after:bottom-[1px] hover:after:right-[1px]  hover:bg-gradient-to-br hover:from-[#55DDFF] hover:to-[#C058F3] hover:border-none hover:after:bg-white hover:after:block hover:after:rounded-full hover:after:z-20 dark:border-[#393A4B] dark:hover:after:bg-[#25273D] dark:hover:text-transparent"
                                        type="submit" data-update="{{ $todo->id }}">
                                        <figure>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9">
                                                <path fill="none" stroke="currentColor" stroke-width="2"
                                                    d="M1 4.304L3.696 7l6-6" />
                                            </svg>
                                        </figure>

                                    </button>
                                </form>

                                <p
                                    class="w-full text-left text-[12px] text-[#494C6B] cursor-pointer  dark:text-[#C8CBE7]">
                                    {{ $todo->name }}</p>
                                <form id="delete_todo_form{{ $todo->id }}" action="{{ route('index.destroy') }}"
                                    method="post">
                                    @csrf
                                    @method('POST')
                                    <button class="text-[#494C6B] align-middle hover:text-red-600  " type="submit"
                                        data-delete="{{ $todo->id }}">
                                        <figure>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                                                <path fill="currentColor" fill-rule="evenodd"
                                                    d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z" />
                                            </svg>
                                        </figure>
                                    </button>
                                </form>
                            </div>
                        @endif

                        @if ($todo->completed)
                            <div id="todo{{ $todo->id }}"
                                class="flex items-baseline gap-6 p-6 todo-row dark:todo-row-dark">
                                <button
                                    class="min-h-[25px] min-w-[25px] flex items-center justify-center rounded-full bg-gradient-to-br from-[#55DDFF] to-[#C058F3] pointer-events-none"
                                    type="submit">
                                    <figure>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9">
                                            <path fill="none" stroke="#FFF" stroke-width="2"
                                                d="M1 4.304L3.696 7l6-6" />
                                        </svg>
                                    </figure>

                                </button>


                                <p class="w-full text-left line-through text-[12px] text-[#D1D2DA]">
                                    {{ $todo->name }}
                                </p>
                                <form id="delete_todo_form{{ $todo->id }}" action="{{ route('index.destroy') }}"
                                    method="post">
                                    @csrf
                                    @method('POST')
                                    <button class="text-[#494C6B] align-middle hover:text-red-600" type="submit"
                                        data-delete="{{ $todo->id }}">
                                        <figure>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                                                <path fill="currentColor" fill-rule="evenodd"
                                                    d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z" />
                                            </svg>
                                        </figure>
                                    </button>
                                </form>

                            </div>
                        @endif
                    @endforeach
                @endif

            </section>

            <div id="todo_list_footer"
                class="justify-between items-center p-6 container mx-auto max-w-[540px] bg-white rounded-bl-lg rounded-br-lg border-t border-[#E3E4F1] dark:bg-[#25273D] dark:border-[#393A4B] {{ isset($todos) && count($todos) > 0 ? 'flex' : 'hidden' }}">
                <p class="text-[12px] text-[#9495A5] flex gap-1">
                    <span id="items_left"></span>
                    <span>items left</span>
                </p>
                <ul class="hidden items-center gap-6 md:flex">
                    <li>
                        <button
                            class="text-[14px] text-[#9495A5] active font-bold hover:text-[#494C6B] dark:hover:text-[#E3E4F1]"
                            type="button">
                            All
                        </button>
                    </li>
                    <li>
                        <button
                            class="text-[14px] text-[#9495A5] font-bold hover:text-[#494C6B] dark:hover:text-[#E3E4F1]"
                            type="button">
                            Active
                        </button>
                    </li>
                    <li>
                        <button
                            class="text-[14px] text-[#9495A5] font-bold hover:text-[#494C6B] dark:hover:text-[#E3E4F1]"
                            type="button">
                            Completed
                        </button>
                    </li>
                </ul>
                <form id="delete_todo_all" action="{{ route('index.destroy.all') }}" method="POST">
                    @csrf
                    @method('POST')
                    <button class="text-[12px] text-[#9495A5] hover:text-[#494C6B] dark:hover:text-[#E3E4F1]"
                        type="submit" data-delete_completed="clear">
                        Clear Completed
                    </button>
                </form>

            </div>
            <div id="todo_filter"
                class="items-center container mx-auto max-w-[540px] justify-center bg-white mt-6 rounded-lg  dark:bg-[#25273D] {{ isset($todos) && count($todos) > 0 ? 'flex md:hidden' : 'hidden' }}">
                <ul class="flex items-center gap-6 py-6">
                    <li>
                        <button
                            class="text-[14px] text-[#9495A5] active font-bold hover:text-[#494C6B] dark:hover:text-[#E3E4F1]"
                            type="button">
                            All
                        </button>
                    </li>
                    <li>
                        <button
                            class="text-[14px] text-[#9495A5] font-bold hover:text-[#494C6B] dark:hover:text-[#E3E4F1]"
                            type="button">
                            Active
                        </button>
                    </li>
                    <li>
                        <button
                            class="text-[14px] text-[#9495A5] font-bold hover:text-[#494C6B] dark:hover:text-[#E3E4F1]"
                            type="button">
                            Completed
                        </button>
                    </li>
                </ul>
            </div>


            <div id="todo_reorder"
                class="flex justify-center mt-12 {{ isset($todos) && count($todos) > 0 ? 'flex' : 'hidden' }}">
                <p class="text-[14px] text-[#9495A5] font-bold">Drag and drop to reorder list</p>
            </div>





        </main>

        {{-- templates --}}
        <template id="newTodoTemplate">
            <div id="todo{id}" class="flex items-baseline gap-6 p-6 todo-row dark:todo-row-dark">
                <form id="update_todo_form{id}" action="{{ route('index.update') }}" method="post">
                    @csrf
                    @method('PUT')
                    <button
                        class="min-h-[25px] min-w-[25px] text-transparent group relative z-10 flex items-center justify-center rounded-full border border-black/10 hover:border-transparent hover:after:content-[''] hover:after:absolute hover:after:top-[1px] hover:after:left-[1px] hover:after:bottom-[1px] hover:after:right-[1px]  hover:bg-gradient-to-br hover:from-[#55DDFF] hover:to-[#C058F3] hover:border-none hover:after:bg-white hover:after:block hover:after:rounded-full hover:after:z-20 dark:border-[#393A4B] dark:hover:after:bg-[#25273D] dark:hover:text-transparent"
                        type="submit" data-update="{id}">
                        <figure>
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9">
                                <path fill="none" stroke="currentColor" stroke-width="2"
                                    d="M1 4.304L3.696 7l6-6" />
                            </svg>
                        </figure>

                    </button>
                </form>

                <p class="w-full text-left text-[12px] text-[#494C6B] cursor-pointer  dark:text-[#C8CBE7]">
                    {name}</p>
                <form id="delete_todo_form{id}" action="{{ route('index.destroy') }}" method="post">
                    @csrf
                    @method('POST')
                    <button class="text-[#494C6B] align-middle hover:text-red-600" type="submit" data-delete="{id}">
                        <figure>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                                <path fill="currentColor" fill-rule="evenodd"
                                    d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z" />
                            </svg>
                        </figure>
                    </button>
                </form>
            </div>
        </template>
        <template id="updateTodoTemplate">
            <div id="todo{id}" class="flex items-baseline gap-6 p-6 todo-row dark:todo-row-dark">
                <button
                    class="min-h-[25px] min-w-[25px] flex items-center justify-center rounded-full bg-gradient-to-br from-[#55DDFF] to-[#C058F3] pointer-events-none"
                    type="submit">
                    <figure>
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9">
                            <path fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6" />
                        </svg>
                    </figure>

                </button>


                <p class="w-full text-left line-through text-[12px] text-[#D1D2DA]">{name}
                </p>
                <form id="delete_todo_form{id}" action="{{ route('index.destroy') }}" method="post">
                    @csrf
                    @method('POST')
                    <button class="text-[#494C6B] align-middle hover:text-red-600" type="submit" data-delete="{id}">
                        <figure>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                                <path fill="currentColor" fill-rule="evenodd"
                                    d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z" />
                            </svg>
                        </figure>
                    </button>
                </form>

            </div>
        </template>

    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
        integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script type="module" src="{{ mix('resources/js/app.js') }}"></script>
</body>

</html>
