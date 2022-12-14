import {
  atom,
  selector,
  RecoilRoot,
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
import { Popover } from "@ant-design/react-native";

interface TodoListItem {
  id: number;
  text: string;
  isComplete: boolean;
}

const TodoListFilter = {
  All: "全部",
  COMPlETE: "已完成",
  UNCOMPLETE: "未完成",
} as const;

function getId() {
  return new Date().getTime();
}

const todoListState = atom<TodoListItem[]>({
  key: "todoListState",
  default: [],
});
// 统计对象
const todoListStatsState = selector({
  key: "todoListStatsState",
  get({ get }) {
    const todoList = get(todoListState);
    const totalNum = todoList.length;
    const totalCompletedNum = todoList.filter((item) => item.isComplete).length;
    const totalUncompletedNum = totalNum - totalCompletedNum;
    const percentCompleted =
      totalNum === 0 ? 0 : (totalCompletedNum / totalNum) * 100;

    return {
      totalNum,
      totalCompletedNum,
      totalUncompletedNum,
      percentCompleted: percentCompleted.toFixed(2),
    };
  },
});

const todoListFilterState = atom<
  typeof TodoListFilter[keyof typeof TodoListFilter]
>({
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
      case TodoListFilter.COMPlETE:
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

function TodoListFilterView() {
  const [filter, setFilter] = useRecoilState(todoListFilterState);
  return (
    <Popover
      triggerStyle={{
        alignItems: "center",
        justifyContent: "center",
      }}
      placement={"auto"}
      duration={200}
      onSelect={(node) => {
        setFilter(node);
      }}
      overlay={Object.values(TodoListFilter).map((item) => (
        <Popover.Item key={item} value={item}>
          <Text>{item}</Text>
        </Popover.Item>
      ))}
    >
      <Text
        style={{
          // width: 100,
          padding: 10,
          textAlign: "center",
        }}
      >
        {filter}
      </Text>
    </Popover>
  );
}

function TodoListStats() {
  const stats = useRecoilValue(todoListStatsState);
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={{ flex: 1 }}>总计: {stats.totalNum}</Text>
      <Text style={{ flex: 1 }}>已完成: {stats.totalCompletedNum}</Text>
      <Text style={{ flex: 1 }}>未完成: {stats.totalUncompletedNum}</Text>
      <Text style={{ flex: 1 }}>{stats.percentCompleted}%</Text>
    </View>
  );
}

function TodoListRender() {
  const todoList = useRecoilValue(filteredTodoListState);

  return (
    <>
      {todoList.length ? (
        todoList.map((todoItem) => (
          <TodoItem key={todoItem.id} item={todoItem} />
        ))
      ) : (
        <Text style={{ textAlign: "center" }}>待办都清空啦</Text>
      )}
    </>
  );
}

export function RecoilTodoList() {
  return (
    <RecoilRoot>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={{ fontSize: 20 }}>Todo List</Text>
          <TodoListFilterView />
        </View>
        <TodoItemCreator />
        <TodoListStats />
        <View style={{ borderTopWidth: 0.5, height: 0, marginVertical: 10 }} />
        <TodoListRender />
      </View>
    </RecoilRoot>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 10,
    // borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    marginBottom: 10,
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
