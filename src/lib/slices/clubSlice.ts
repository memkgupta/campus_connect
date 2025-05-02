import { ClubDetails, ClubMember, ClubNotification, ClubRole, ClubTask, Event, Message, Team } from "@/types/club-dashboard";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StringExpressionOperatorReturningNumber } from "mongoose";

interface EntityState<T> {
    data: T;
    isLoading: boolean;
    error: string | null;
}

interface ClubState {
    events:EntityState<{total:number,events:Event[]}>;
    tasks: EntityState<{ total: number; tasks: ClubTask[] }>;
    messages: EntityState<{ messages: Message[]; total: number }>;
    teams: EntityState<Team[]>;
    selectedTask:EntityState<{task:ClubTask,purpose:string}|null>,
    members:EntityState<{members:ClubMember[];total:number}>,
    roles: EntityState<ClubRole[]>;
    notifications: EntityState<ClubNotification[]>;
    details: EntityState<ClubDetails>;
}

const initialState: ClubState = {
    events:{data:{total:0,events:[]},isLoading:false,error:null},
    selectedTask:{data:null,isLoading:false,error:null},
    tasks: { data: { total: 0, tasks: [] }, isLoading: false, error: null },
    messages: { data: { messages: [], total: 0 }, isLoading: false, error: null },
    teams: { data: [], isLoading: false, error: null },
    roles: { data: [], isLoading: false, error: null },
    notifications: { data: [], isLoading: false, error: null },
    details: { data: {} as ClubDetails, isLoading: false, error: null },
    members:{data:{members:[],total:0},isLoading:false,error:null}
};

const clubSlice = createSlice({
    name: "club-dashboard",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<{ entity: keyof ClubState; isLoading: boolean }>) => {
            state[action.payload.entity].isLoading = action.payload.isLoading;
        },
        setError: (state, action: PayloadAction<{ entity: keyof ClubState; error: string | null }>) => {
            state[action.payload.entity].error = action.payload.error;
        },
        setMembers:(state,action:PayloadAction<ClubMember[]>)=>{
            state.members.data.members = action.payload
        },
        setEvents:(state,action:PayloadAction<Event[]>)=>{
            state.events.data.events = action.payload;
            state.events.data.total = action.payload.length;
        },
        addMember:(state,action:PayloadAction<ClubMember>)=>{
state.members.data.members = [...state.members.data.members,action.payload];
        },
        removeMember:(state,action:PayloadAction<string>)=>{
            state.members.data.members = state.members.data.members.filter(m=>m._id!=action.payload);
        },
        updateMember:(state,action:PayloadAction<ClubMember>)=>{
            state.members.data.members = state.members.data.members.map(m=>m._id===action.payload._id?action.payload:m);
        },
        // Tasks
        setTasks: (state, action: PayloadAction<ClubTask[]>) => {
            state.tasks.data.tasks = action.payload;
            state.tasks.data.total = action.payload.length;
        },
        addTask: (state, action: PayloadAction<ClubTask>) => {
            state.tasks.data.tasks.push(action.payload);
            state.tasks.data.total++;
        },
        deleteTask: (state, action: PayloadAction<string>) => {
            state.tasks.data.tasks = state.tasks.data.tasks.filter(t => t._id !== action.payload);
            state.tasks.data.total--;
        },
        updateTask: (state, action: PayloadAction<ClubTask>) => {
            state.tasks.data.tasks = state.tasks.data.tasks.map(t => (t._id === action.payload._id ? action.payload : t));
        },
        setSelectedTask:(state,action:PayloadAction<{task:ClubTask,purpose:string}|null>)=>{
            state.selectedTask.data = action.payload;
        },
        // Messages
        setMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages.data.messages = action.payload;
            state.messages.data.total = action.payload.length;
        },
        removeMessage: (state, action: PayloadAction<string>) => {
            state.messages.data.messages = state.messages.data.messages.filter(m => m._id !== action.payload);
            state.messages.data.total--;
        },

        // Teams
        setTeams: (state, action: PayloadAction<Team[]>) => {
            state.teams.data = action.payload;
        },
        addTeam: (state, action: PayloadAction<Team>) => {
            state.teams.data.push(action.payload);
        },
        updateTeam: (state, action: PayloadAction<Team>) => {
            const team = state.teams.data.find(t => t._id === action.payload._id);
            if (team) Object.assign(team, action.payload);
        },
        deleteTeam: (state, action: PayloadAction<string>) => {
            state.teams.data = state.teams.data.filter(t => t._id !== action.payload);
        },

        // Roles
        setRoles: (state, action: PayloadAction<ClubRole[]>) => {
            state.roles.data = action.payload;
        },
        addRole: (state, action: PayloadAction<ClubRole>) => {
            state.roles.data.push(action.payload);
        },
        updateRole: (state, action: PayloadAction<ClubRole>) => {
            const role = state.roles.data.find(r => r._id === action.payload._id);
            if (role) Object.assign(role, action.payload);
        },
        deleteRole: (state, action: PayloadAction<string>) => {
            state.roles.data = state.roles.data.filter(r => r._id !== action.payload);
        },

        // Notifications
        setNotifications: (state, action: PayloadAction<ClubNotification[]>) => {
            state.notifications.data = action.payload;
        },
        addNotification: (state, action: PayloadAction<ClubNotification>) => {
            state.notifications.data.push(action.payload);
        },
        updateNotification: (state, action: PayloadAction<ClubNotification>) => {
            const notification = state.notifications.data.find(n => n._id === action.payload._id);
            if (notification) Object.assign(notification, action.payload);
        },
        deleteNotification: (state, action: PayloadAction<string>) => {
            state.notifications.data = state.notifications.data.filter(n => n._id !== action.payload);
        },

        // Club Details
        setClubDetails: (state, action: PayloadAction<ClubDetails>) => {
            state.details.data = action.payload;
        },
        updateClubDetails: (state, action: PayloadAction<Partial<ClubDetails>>) => {
            Object.assign(state.details.data, action.payload);
        }
    }
});

export const {
    setLoading,
    setError,
    setTasks,
    addTask,
    setEvents,
    deleteTask,
    updateTask,
    setMessages,
    removeMessage,
    setTeams,
    addTeam,
    updateTeam,
    deleteTeam,
    setRoles,
    setMembers,
    addRole,
    updateRole,
    deleteRole,
    setNotifications,
    addNotification,
    updateNotification,
    deleteNotification,
    setClubDetails,
    updateClubDetails,
    setSelectedTask
} = clubSlice.actions;


export default clubSlice.reducer;
