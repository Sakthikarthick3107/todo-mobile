import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Alert, Button, Image,  ImageBackground,  Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import nodata from './assets/data-not-found.png';
import logo from './assets/splash.png';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';




export default function App() {
  const[newTask , setNewTask] = useState('');
  const[todos , setTodos] = useState([]);
  const[isModalVisible , setIsModalVisible] = useState(false);
  const[selectTask , setSelectTask] = useState([]);



  const loadTasks =async () =>{
    try {
      const storedTasks = await AsyncStorage.getItem('todos');
      if(storedTasks !== null){
        setTodos(JSON.parse(storedTasks))
      }
    } catch (error) {
      console.error('Error while loading your tasks!')
    }
  }
  useEffect(() =>{
    loadTasks();
  },[]);

  const saveToAsync = async(updateToStorage) =>{
    try {
      await AsyncStorage.setItem('todos' , JSON.stringify(updateToStorage))
    } catch (error) {
      console.error('Error saving tasks to AsyncStorage:', error);
    }
  }


  const openModal = (task) =>{
    setIsModalVisible(true);
    setSelectTask([task]);
    // console.log(selectTask)
  }

  const getTime = () =>{
    const myDate = new Date();
    const hours = myDate.getHours();
    const minutes = myDate.getMinutes();
    const alteredMinutes = minutes <= 9 ? "0"+ minutes : minutes;
    const alteredHours = hours > 12 ? hours-12 : hours;
    const dayornight = hours > 12 ? 'pm' : 'am';
    return `${alteredHours} : ${alteredMinutes} ${dayornight}`
  }
  const getDate = () =>{
    const days = ['Sun' , 'Mon' , 'Tue' , 'Wed' , 'Thurs' , 'Fri' , 'Sat'];

    const myDate = new Date();
    const date = myDate.getDate();
    const day = myDate.getDay();
    const month = myDate.getMonth();
    // const suffix = date ===1 ? 'st' : date === 2 ? 'nd' : date === 3 ? 'rd' :'th';
    return `${days[day]} ${date} / ${month+1}`;
  }


  const createTodo = () =>{
    const data = {
      task : newTask,
      isCompleted : false,
      created : getTime(),
      date : getDate(),
      completed:''
    }
    const ifExists = todos.filter(prev => prev.task === newTask);
    

    if(newTask === ""){
      Alert.alert(
        'Oops',
        'Empty task can\'t be created '
      )
    }
    else if(ifExists.length !== 0){
      Alert.alert(
        'Oops',
        'This task is already created'
      )
    }
    else{
      const newArr = [data , ...todos];
      setTodos(newArr);
      saveToAsync(newArr);
      Alert.alert(
      'Success',
      `Task "${newTask}" is created `
    );
    setNewTask('');
    }
    
  }
  const completeTask = (task) =>{
    const myDate = new Date();
    const hours = myDate.getHours();
    const minutes = myDate.getMinutes();

     const updatedArr = todos.map(todo =>{
      if(todo.task === task){
        return {...todo , isCompleted : true ,  completed : getTime()}
      }
      return todo;
    });
    setTodos(updatedArr);
    saveToAsync(updatedArr);
    Alert.alert(
      'Completed',
      `Task "${task}" is completed`
    );
    setIsModalVisible(false);
  }

  const deleteTask = (task) =>{
    const updateAfterDelete = todos.filter(todo => todo.task !== task);
    setTodos(updateAfterDelete);
    saveToAsync(updateAfterDelete);
    Alert.alert(
      'Deleted',
      `Task "${task}" is removed from your task lists`
    );
    setIsModalVisible(false);
  }

  return (
    <SafeAreaView tw='flex-1 bg-[#F0F8FF] items-center py-10'>

      {/* <ImageBackground source={logo} tw='flex-1 flex items-center h-[100vh] w-[100vw]' imageStyle={{ opacity:0.2}} > */}
      <View tw='my-2'>
        <Text tw="text-3xl font-bold">Todo</Text>
      </View>

      <View tw='flex flex-row items-center justify-between w-[90vw] p-2 rounded-md bg-[#15b0ed] z-30'>
        <TextInput tw='text-lg text-white w-[85%]' value={newTask} placeholder='Create your todos here...' onChangeText={(text) => setNewTask(text)} />
        <AntDesign onPress={createTodo} name="enter" size={24} color="black" />
      </View>

      {todos.length === 0 ? 
      <View tw='flex-1 my-2 flex-column items-center justify-center'>
        <Image source={nodata} tw='h-[30vh] w-[70vw]'/>
        <Text tw='text-lg'>Start to create and track your daily tasks...</Text>
      </View>
        :
      <>
      <View tw='w-full flex items-center justify-center my-2'>
        <Text tw='text-lg'>Your Tasks</Text>
      </View>

      <ScrollView tw=' my-4 flex-1 w-[90vw] ' showsVerticalScrollIndicator={false}>
        {todos.map((todo , index) => (
          <Pressable onPress={()=>openModal(todo)} key={index} tw={`w-full 
                                                                    flex flex-row 
                                                                    items-center 
                                                                    justify-between 
                                                                    border border-solid 
                                                                    border-slate-300 
                                                                    rounded-md  
                                                                    p-2 bg-[#f0f0f0] 
                                                                    my-2 shadow-xl z-30 
                                                                    ${todo.isCompleted && 'border-r-green-500 border-r-4'}
                                                                    `}>
            <Text tw='text-lg'>{todo.task}</Text>
            <Text tw='text-slate-600 text-xs'>{todo.isCompleted? todo.completed: todo.created} </Text>
          </Pressable>
        ))}
      </ScrollView>
      {/* <Modal 
        visible={isModalVisible} 
        onRequestClose={() => setIsModalVisible(false)} 
        animationType='slide' 
        presentationStyle='pageSheet'> */}
      <Modal isVisible={isModalVisible} tw=''
              animationIn='fadeInDown'
              animationOut='fadeOutUp'
              animationInTiming={500} // Set the duration for the slide-in animation (in milliseconds)
              animationOutTiming={500} // Set the duration for the slide-out animation (in milliseconds)  
              onBackButtonPress={() => setIsModalVisible(false)}
              onBackdropPress={() => setIsModalVisible(false)}>
        <View tw='flex-1 items-center justify-center w-full'>
          <View tw='w-full flex items-center justify-center'>
            <Image source={logo} tw='h-[30vh] w-[50vw]'/>
          </View>
          {selectTask.map((item,index) => (
            <View key={index} tw='flex w-full h-[40vh] items-center py-6'>
                <Text tw='text-4xl font-bold text-white'>{item.task}</Text>
                <Text tw='text-white'>Created at {item.created} - {item.date}</Text>
                {item.isCompleted &&
                <Text tw='text-white'>Completed at {item.completed}</Text>
                }
                <View tw='flex flex-row items-center'>
                  <Text tw='text-white'>Status</Text>
                  {item.isCompleted ? <MaterialCommunityIcons name="sticker-check" size={24} color="green" /> :
                  <Entypo name="squared-cross" size={24} color="red" />
                  }
                  
                </View>
                {!item.isCompleted  &&
                <TouchableOpacity onPress={()=> completeTask(item.task)} tw='w-[80vw] rounded-md flex items-center justify-center mt-2 p-1 bg-green-500'>
                    <Text  tw='text-lg text-white'>Complete</Text>
                </TouchableOpacity>
                }
                <TouchableOpacity onPress={() => deleteTask(item.task)} tw='w-[80vw] rounded-md flex items-center justify-center mt-2 p-1 bg-red-500'>
                    <Text  tw='text-lg text-white'>Delete</Text>
                </TouchableOpacity>
                
            </View>
          ))}
          {/* <Button title='Close Modal' onPress={() => {
            PushNotification.localNotification ({
              title:"Pressed",
              message:'Pressed the button'
            })
          }}/> */}

        </View>
      </Modal>
      </>
      }
      <StatusBar backgroundColor='#15bded'  style="auto" />
      {/* <View tw='w-full absolute bottom-0 bg-[#15bded] h-[50]'>

      </View> */}
      {/* </ImageBackground> */}

    </SafeAreaView>
  );
}


