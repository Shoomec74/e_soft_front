import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Определение типа для состояния модальных окон
type TModalState = {
  data: any;
  addUserModal: boolean;
  modalDisplay: boolean;
};

// Начальное состояние
const initialState: TModalState = {
  data: null,
  addUserModal: false,
  modalDisplay: false,
};

// Создание slice для модальных окон
const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    showModal(state) {
      state.modalDisplay = true;
    },
    showModalAddUser(state, action) {
      state.data = action.payload;
      state.addUserModal = true;
    },
    hideModal(state) {
      state.data = null;
      state.addUserModal = false;
      state.modalDisplay = false;
    },
  },
});


export const {
  showModal,
  hideModal,
} = modalsSlice.actions;

export default modalsSlice.reducer;
