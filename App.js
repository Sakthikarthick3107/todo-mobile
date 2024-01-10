import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { Alert, Image, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import nodata from './assets/data-not-found.png';

export default function App() {
  const[newTask , setNewTask] = useState('');
  const[todos , setTodos] = useState([]);


  const createTodo = () =>{
    const myDate = new Date();
    const hours = myDate.getHours();
    const minutes = myDate.getMinutes();
    const data = {
      task : newTask,
      isCompleted : false,
      created : `${hours} : ${minutes}`
    }

    if(newTask === ""){
      Alert.alert(
        'Oops',
        'Empty task can\'t be created '
      )
    }
    else{
      const newArr = [data , ...todos];
      setTodos(newArr);
      Alert.alert(
      'Success',
      `Task "${newTask}" is created `
    );
    setNewTask('');
    }
    
  }
  return (
    <SafeAreaView tw='flex-1 bg-[#F0F8FF] items-center py-10'>
      <View tw='my-2'>
        <Text tw="text-3xl font-bold">Todo</Text>
      </View>

      <View tw='flex flex-row items-center justify-between w-[90vw] p-2 rounded-md bg-[#15b0ed] z-30'>
        <TextInput tw='text-lg text-white w-[85%]' value={newTask} placeholder='Create your todos here...' onChangeText={(text) => setNewTask(text)} />
        <AntDesign onPress={createTodo} name="enter" size={24} color="black" />
      </View>

      {todos.length === 0 ? 
      <View tw='flex-1 my-2 flex-column items-center justify-center'>
        <Image source={nodata} tw='h-[40vh] w-[80vw]'/>
        <Text tw='text-lg'>Start to create and track your daily tasks...</Text>
      </View>
        :
      <>
      <View tw='w-full flex items-center justify-center my-2'>
        <Text tw='text-lg'>Your Tasks</Text>
      </View>

      <ScrollView tw=' my-4 flex-1 w-[90vw] ' showsVerticalScrollIndicator={false}>
        {todos.map((todo , index) => (
          <View key={index} tw='w-full border border-solid border-slate-300 rounded-md  p-2 bg-[#f0f0f0] my-2 shadow-xl z-30'>
            <Text tw='text-lg'>{todo.task}</Text>
            <Text tw='text-slate-600 text-xs absolute bottom-1 right-1'>{todo.created} </Text>
          </View>
        ))}
      </ScrollView>
      </>
      }
      <StatusBar  style="auto" />
    </SafeAreaView>
  );
}


