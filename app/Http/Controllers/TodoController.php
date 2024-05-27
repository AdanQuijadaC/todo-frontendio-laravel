<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    //
    public function index()
    {
        $todos = Todo::all();
        foreach ($todos as $todo) {
            $todo->active = boolval($todo->active);
            $todo->completed = boolval($todo->completed);
        }
        return view('index', compact("todos"));
    }


    public function create(Request $request)
    {

        $todo = new Todo();
        $todo->name = ucfirst($request->input("name"));
        $todo->active = true;
        $todo->completed = false;
        $todo->save();

        $todos = Todo::all();

        foreach ($todos as $todo) {
            $todo->active = boolval($todo->active);
            $todo->completed = boolval($todo->completed);
        }

        return response()->json([$todo, $todos]);
    }

    public function update(Request $request)
    {

        $todo = Todo::find($request->input("id"));
        $todo->active = false;
        $todo->completed = true;
        $todo->save();


        $todos = Todo::all();

        foreach ($todos as $item) {
            $item->active = boolval($item->active);
            $item->completed = boolval($item->completed);
        }

        return response()->json([$todo, $todos]);
    }

    public function destroy(Request $request)
    {

        Todo::find($request->input("id"))->delete();

        $todos = Todo::all();

        foreach ($todos as $todo) {
            $todo->active = boolval($todo->active);
            $todo->completed = boolval($todo->completed);
        }

        return response()->json([$request->input("id"), $todos]);
    }

    public function destroyAll()
    {
        $previousTodos = Todo::all();

        Todo::where("completed", true)->delete();
        $todos = Todo::all();
        foreach ($todos as $todo) {
            $todo->active = boolval($todo->active);
            $todo->completed = boolval($todo->completed);
        }

        if ($previousTodos) {
            foreach ($previousTodos as $previousTodo) {
                $previousTodo->active = boolval($previousTodo->active);
                $previousTodo->completed = boolval($previousTodo->completed);
            }
            return response()->json([$previousTodos, $todos]);
        } else {
            return response()->json("nothing");
        }
    }

    public function todos()
    {
        $todos = Todo::all();

        foreach ($todos as $todo) {
            $todo->active = boolval($todo->active);
            $todo->completed = boolval($todo->completed);
        }
        return response()->json($todos);
    }
}
