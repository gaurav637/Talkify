import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  _id: "",
  name: "",
  email: "",
  profile_pic: "",
  token: "",
  onlineUser: [],
  socketConnection: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state._id = action.payload._id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profile_pic = action.payload.profile_pic;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      if (state.socketConnection) {
        state.socketConnection.disconnect();
      }
      state._id = "";
      state.name = "";
      state.email = "";
      state.profile_pic = "";
      state.token = "";
      state.socketConnection = null;
    },
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
    setSocketConnection: (state, action) => {
      console.log('Setting socketConnection:', action.payload);
      state.socketConnection = action.payload;
    }
  }
});

// Action creators
export const { setUser, setToken, logout, setOnlineUser, setSocketConnection } = userSlice.actions;

export default userSlice.reducer;
