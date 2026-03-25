import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showLogin: false,
};


const uiSlice=createSlice({
  name:"ui",
  initialState,
  reducers:{
    setOpenLogin:(state)=>{
      state.showLogin=true;
    },
    setCloseLogin:(state)=>{
      state.showLogin=false;
    }
  }
});


export const {setOpenLogin,setCloseLogin}=uiSlice.actions;
export default uiSlice.reducer;