import React, { useEffect, useState } from 'react'
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addToPastes, updateToPastes } from '../redux/pasteSlice';
import toast from 'react-hot-toast';
import { Copy, PlusCircle } from 'lucide-react';
const Home = () => {
   
    const[title,setTitle]=useState("");
    const[value,setValue]=useState("");
    const[searchParams,setSearchParams]=useSearchParams();// Destructure useSearchParams
     const pasteId=searchParams.get("pasteId"); // Get pasteId from the search params 
     const dispatch=useDispatch();
     const allPastes=useSelector(
      (state)=>state.paste.pastes
     );

     // it is used when user want to see/view  its specific paste from pastes
   
     useEffect(() => {
      if(pasteId)
      {
        const paste=allPastes.find(
         (item)=>item?._id===pasteId);
  
         if(paste)
         {
           setTitle(paste?.title);
           setValue(paste?.content);
         }
      }
    }, [pasteId]);

    //  it is used to reset title and content when we go to pastes and then edit it
    function resetPaste()
    {
      setTitle("");
      setValue("");
      setSearchParams({});
      // navigate("/");
    }

      // main important function to create paste
     function createPaste()
     {

      if (!title?.trim()) {
        toast.error("Title cannot be empty!",{
          duration: 3000, // Toast disappears after 3s
          style: {
            background: "#DC2626", // Red background
            color: "#FFFFFF", // White text
            fontWeight: "bold",
            padding: "16px",
            borderRadius: "10px",
            border: "2px solid #B91C1C", // Darker red border
          },
        });
        return;
      }

    

      
        
      // the paste object which is sent to store and then pasteslice and it is in Action.payload
        const paste={
            title:title,
            content:value,
            _id:pasteId || Date.now().toString(36),
            createdAt:new Date().toISOString(),

        }
      
        if(pasteId)
        {
          // If pasteId is present, update the paste
            //updating the paste
              dispatch(updateToPastes(paste));
        }else{
            //creating new paste
            //  if you have a paste with existing same title
      const existingPaste=allPastes.find((item)=>item.title?.toLowerCase()==title.toLowerCase());
            // functtion to not create a paste with same title
      if(existingPaste)
        {
          toast.error("A paste with the same title already exists!", {
            duration: 3000, // Toast disappears after 3s
            style: {
              background: "#DC2626", // Red background
              color: "#FFFFFF", // White text
              fontWeight: "bold",
              padding: "16px",
              borderRadius: "10px",
              border: "2px solid #B91C1C", // Darker red border
            },
          });
        return;
        }
               dispatch(addToPastes(paste));
        }
        //  clears the title and content after ctreating paste
        setTitle("");
        setValue("");

        // Remove the pasteId from the URL after creating/updating a paste
        setSearchParams({});

     };

    
     

  return (
    // it is used to give some space in left and right equally
    <div className='w-full h-full max-w-[1200px] mx-auto  py-8 px-5 lg:px-0'>

      {/* it is second outer covering and it is used to set everyone in column */}
   <div className='flex flex-col gap-y-6 items-start'>
    {/* it contains the title and create paste btn section */}
     <div className='w-full flex flex-row justify-between items-center gap-x-4 '>
      {/* Dynamic width based on whether pasteId is present */}
      <input className={`${pasteId?"w-[80%]":"w-[87%]"} dark-change dark:focus:border-[#646cff] outline-none focus:border-black p-2 rounded-md   border-2 border-[rgba(128,121,121,0.5)] dark:bg-[#1a1a1a]`} placeholder="Title" type="text"  value={title} onChange={(e)=>{setTitle(e.target.value)}} />
      <button className='btn px-5 py-2.5  rounded-lg bg-blue-600 hover:bg-blue-700  text-white font-medium ' onClick={createPaste}> {pasteId?"Update Note":"Create Note" }</button>
      {pasteId && <button className='btn px-5 py-2.5 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300' onClick={resetPaste}><PlusCircle size={20}/></button>}
    </div>
     {/* it contains the whole text area */}
    <div className='group  textbox-content w-full flex flex-col rounded items-start border-[0px]  bg-opacity-10  backdrop-blur-2xl'>
      {/* header box it contains the smal circles and copy btn */}
      <div className="   header-box w-full rounded-t-md flex flex-row justify-between items-center gap-x-4 px-4 py-2 border-x-2 border-t-2 border-[rgba(128,121,121,0.5)]">

        <div className="circle-container flex flex-row justify-evenly items-center gap-x-3  ">

        <div className="circle   bg-[rgb(255,95,87)]"></div>
        <div className="circle  bg-[rgb(254,188,46)]"></div>
        <div className="circle  bg-[rgb(45,200,66)]"></div>
        </div>
        {/* copy btn  */}
        <div className="copy-btn">
          <button className=' rounded-lg font-medium flex justify-center items-center pr-4 transition-all duration-300 ease-in-out group' onClick={() => { navigator.clipboard.writeText(value); toast.success("Copied to clipboard"),{position:"top-right",} }}> <Copy className='group-hover:text-sucess-500' size={20}/>   </button>
        </div>
      </div>
        {/* Textarea */}
      <textarea className=' w-full p-3   group-hover:dark-change dark:focus:border-[#646cff] outline-none focus:border-black border-2 border-[rgba(128,121,121,0.5)] rounded-b-md rounded-t-none dark:bg-[#1a1a1a]' style={{ caretColor: "#000",}} name="" id="" placeholder='Write Your Content Here....' value={value} rows={20} onChange={(e)=>{setValue(e.target.value)}}></textarea>
    </div>
     </div>
   
    </div>
  )
}

export default Home
