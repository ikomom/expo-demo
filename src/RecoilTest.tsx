import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { useState } from "react";
import {
  Button,
  TextInput,
  View,
  StyleSheet,
  Text,
  Switch,
} from "react-native";

interface TodoListItem {
  id: number;
  text: string;
  isComplete: boolean;
}

enum TodoListFilter {
  All,
  COMPlELTE,
  UNCOMPLETE,
}

function getId() {
  return new Date().getTime();
}

const todoListState = atom<TodoListItem[]>({
  key: "todoListState",
  default: [],
});

const todoListFilterState = atom<TodoListFilter>({
  key: "todoListFilterState",
  default: TodoListFilter.All,
});

const filteredTodoListState = selector({
  key: "filteredTodoListState",
  get({ get }) {
    const filter = get(todoListFilterState);
    const list = get(todoListState);

    switch (filter) {
      case TodoListFilter.All:
        return list;
      case TodoListFilter.COMPlELTE:
        return list.filter((i) => i.isComplete);
      case TodoListFilter.UNCOMPLETE:
        return list.filter((i) => !i.isComplete);
    }
  },
});

function TodoItemCreator() {
  const [inputValue, setInputValue] = useState("");
  const setTodoList = useSetRecoilState(todoListState);

  const addItems = () => {
    setTodoList((old) => [
      ...old,
      { id: getId(), text: inputValue, isComplete: false },
    ]);
    setInputValue("");
  };

  return (
    <View style={styles.inputItem}>
      <TextInput
        style={styles.input}
        value={inputValue}
        placeholder={"待办事项"}
        onChangeText={setInputValue}
      />
      <View style={{ width: 120 }}>
        <Button title={"添加"} onPress={addItems} />
      </View>
    </View>
  );
}

function TodoItem({ item }) {
  const [todoList, setTodoList] = useRecoilState(todoListState);
  const index = todoList.findIndex((listItem) => listItem === item);

  const editItemText = (value: string) => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      text: value,
    });

    setTodoList(newList);
  };

  const toggleItemCompletion = () => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      isComplete: !item.isComplete,
    });

    setTodoList(newList);
  };

  const deleteItem = () => {
    const newList = removeItemAtIndex(todoList, index);

    setTodoList(newList);
  };

  return (
    <View style={styles.inputItem}>
      <TextInput
        style={styles.input}
        value={item.text}
        editable={!item.isComplete}
        onChangeText={editItemText}
        placeholder={"请输入"}
      />
      <Switch
        value={item.isComplete}
        style={{ borderWidth: 1, borderColor: "red" }}
        onChange={toggleItemCompletion}
      />
      {item.isComplete ? (
        <View style={styles.button}>
          <Button title={"X"} onPress={deleteItem} color={"red"} />
        </View>
      ) : (
        <View style={styles.button} />
      )}
    </View>
  );
}

function replaceItemAtIndex(arr, index, newValue) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

function removeItemAtIndex(arr, index) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}
export function RecoilTodoList() {
  const todoList = useRecoilValue(filteredTodoListState);

  return (
    <View style={styles.container}>
      <View style={{ borderBottomWidth: 1, marginBottom: 10 }}>
        <Text style={{ fontSize: 20 }}>Todo List</Text>
      </View>
      {/* <TodoListStats /> */}
      {/* <TodoListFilters /> */}
      <TodoItemCreator />
      <View style={{ borderTopWidth: 0.5, height: 0, marginVertical: 10 }} />
      {todoList.map((todoItem) => (
        <TodoItem key={todoItem.id} item={todoItem} />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 10,
    // borderWidth: 1,
  },
  inputItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "lightblue",
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: "60%",
    borderBottomWidth: 1,
    borderColor: "gray",
    marginRight: 8,
    paddingLeft: 8,
  },
  button: {
    marginHorizontal: 8,
    width: 40,
  },
});
