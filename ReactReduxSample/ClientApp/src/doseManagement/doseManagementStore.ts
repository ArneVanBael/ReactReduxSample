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
export interface LoadDosesAction {type: 'LOAD_DOSES'};
export interface DosesReceivedAction {type: 'DOSES_RECEIVED', doses:Dose[]};
export interface OpenDoseAdjustmentModalAction {type: 'OPEN_ADJUSTMENT_MODAL', dose:Dose};
export interface CloseDoseAdjustmentModalAction {type :'CLOSE_ADJUSTMENT_MODAL'};
export interface UpdateDoseAction {type: 'UPDATE_DOSE', updatedDose: Dose};

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = LoadDosesAction | DosesReceivedAction | OpenDoseAdjustmentModalAction | CloseDoseAdjustmentModalAction | UpdateDoseAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    loadDoses: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.doseManagement && !appState.doseManagement.dosesAreLoading) {
            
            dispatch({ type: 'LOAD_DOSES' });
            // normally we fetch data from the dosimetry api (simulate with delay)
            setTimeout(() => {
                let doses : Dose[]  = [
                    {id:1, date:'14 januari', hp10Dose: 0.15, remark: "opgelopen dosis 14 januari" },
                    {id:2, date:'15 januari', hp10Dose: 0.30, remark: "werken aan de reactor" },
                    {id:2, date:'18 januari', hp10Dose: 0.10, remark: "Bezoek aan doel" }
                  ];
                  
                dispatch({type: 'DOSES_RECEIVED', doses: doses});
            }, 1000);
        }
    },
    openDoseAdjustmentModal:(selectedDose: Dose) => ({type: 'OPEN_ADJUSTMENT_MODAL', dose: selectedDose} as OpenDoseAdjustmentModalAction),
    closeDoseAdjustmentModal: () => ({type: 'CLOSE_ADJUSTMENT_MODAL'} as CloseDoseAdjustmentModalAction),
    updateDose: (updatedDose: Dose): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({type: 'UPDATE_DOSE', updatedDose: updatedDose});
        dispatch({type: "CLOSE_ADJUSTMENT_MODAL"});
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
        case 'LOAD_DOSES':
            return {...state, dosesAreLoading: true};
        case 'DOSES_RECEIVED':
            return {...state, doses: action.doses, dosesAreLoading: false, dosesLoaded: true};
        case 'OPEN_ADJUSTMENT_MODAL':
            return {...state, modelOpen:true, selectedDose: action.dose};
        case 'CLOSE_ADJUSTMENT_MODAL':
            return {...state, modelOpen:false, selectedDose: undefined};
        case 'UPDATE_DOSE':
            let doses: Dose[] = state.doses.map((dose: Dose) => {
                if(dose.id !== action.updatedDose.id) return dose;
                return {...dose, remark: action.updatedDose.remark, hp10Dose: action.updatedDose.hp10Dose};
            });
            
            return {...state, doses: doses};
        default:
            return state;
    }
};
