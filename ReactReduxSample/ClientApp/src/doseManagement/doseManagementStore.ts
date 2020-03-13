import { Action, Reducer } from 'redux';
import { AppThunkAction } from '../store';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.
export interface DoseManagementState {
    doses: Dose[],
    selectedDose?: Dose,
    modelOpen: boolean,
    dosesLoaded: boolean,
    dosesAreLoading: boolean
};

export interface Dose {
    id:number;
    date: string;
    hp10Dose: number;
    remark: string;
};

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export enum ActionTypesEnum  {
    LoadDosesAction = 'LOAD_DOSES',
    DosesReceivedAction = 'DOSES_RECEIVED',
    OpenDoseAdjustmentModalAction = 'OPEN_ADJUSTMENT_MODAL',
    CloseDoseAdjustmentModalAction = 'CLOSE_ADJUSTMENT_MODAL',
    UpdateDoseAction = 'UPDATE_DOSE'
}

export interface LoadDosesAction {type: ActionTypesEnum.LoadDosesAction, payload: any};
export interface DosesReceivedAction {type: ActionTypesEnum.DosesReceivedAction, payload:Dose[]};
export interface OpenDoseAdjustmentModalAction {type: ActionTypesEnum.OpenDoseAdjustmentModalAction, payload:Dose};
export interface CloseDoseAdjustmentModalAction {type : ActionTypesEnum.CloseDoseAdjustmentModalAction, payload: any};
export interface UpdateDoseAction {type: ActionTypesEnum.UpdateDoseAction, payload: Dose};

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = LoadDosesAction | DosesReceivedAction | OpenDoseAdjustmentModalAction | CloseDoseAdjustmentModalAction | UpdateDoseAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    loadDosesFromApi: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.doseManagement && !appState.doseManagement.dosesAreLoading) {
            
            dispatch({type: ActionTypesEnum.LoadDosesAction, payload: {}});
            // normally we fetch data from the dosimetry api (simulate with delay)
            setTimeout(() => {
                let doses : Dose[]  = [
                    {id:1, date:'14 januari', hp10Dose: 0.15, remark: "opgelopen dosis 14 januari" },
                    {id:2, date:'15 januari', hp10Dose: 0.30, remark: "werken aan de reactor" },
                    {id:2, date:'18 januari', hp10Dose: 0.10, remark: "Bezoek aan doel" }
                  ];
                  
                dispatch({type: ActionTypesEnum.DosesReceivedAction, payload: doses});
            }, 1000);
        }
    },
    openDoseAdjustmentModal:(selectedDose: Dose) => ({type: ActionTypesEnum.OpenDoseAdjustmentModalAction, payload: selectedDose}),
    closeDoseAdjustmentModal: () => ({type: ActionTypesEnum.CloseDoseAdjustmentModalAction, payload: {}}),
    updateDose: (updatedDose: Dose): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({type: ActionTypesEnum.UpdateDoseAction, payload: updatedDose});
        dispatch({type: ActionTypesEnum.CloseDoseAdjustmentModalAction, payload: {}});
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
export const reducer: Reducer<DoseManagementState> = (state: DoseManagementState | undefined, incomingAction: Action): DoseManagementState => {
    if (state === undefined) {
        return { 
            doses: [],
            dosesLoaded: false,
            dosesAreLoading: false,
            modelOpen: false,
            selectedDose: undefined
        };
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case ActionTypesEnum.LoadDosesAction:
            return loadDoses(state);
        case ActionTypesEnum.DosesReceivedAction:
            return receiveDoses(state, action.payload);
        case ActionTypesEnum.OpenDoseAdjustmentModalAction:
            return openAdjustmentModal(state, action.payload);
        case ActionTypesEnum.CloseDoseAdjustmentModalAction:
            return closeAdjustmentModal(state);
        case ActionTypesEnum.UpdateDoseAction:
            return updateDose(state, action.payload)
        default:
            return state;
    }
};


// REDUCER FUNCTIONS
const loadDoses = (state: DoseManagementState) => {
    return {...state, dosesAreLoading: true};
};

const receiveDoses = (state: DoseManagementState, doses: Dose[]) => {
    return {...state, doses: doses, dosesAreLoading: false, dosesLoaded: true};
};

const openAdjustmentModal = (state: DoseManagementState, dose: Dose) => {
    return {...state, modelOpen:true, selectedDose: dose};
};

const closeAdjustmentModal = (state: DoseManagementState) => {
    return {...state, modelOpen:false, selectedDose: undefined};
};

const updateDose = (state: DoseManagementState, updatedDose: Dose) => {
    let doses: Dose[] = state.doses.map((dose: Dose) => {
        if(dose.id !== updatedDose.id) return dose;
        return {...dose, remark: updatedDose.remark, hp10Dose: updatedDose.hp10Dose};
    });
    
    return {...state, doses: doses};
}