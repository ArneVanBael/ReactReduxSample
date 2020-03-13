import * as React from 'react';
import { ApplicationState } from '../store';
import * as DoseManagementStore from './doseManagementStore';
import {useSelector, useDispatch} from 'react-redux';
import {actionCreators} from './doseManagementStore';
import './doseManagement.scss';
import DoseTable from './dosesTable/dosesTable';

const DoseManagement = () => {
  const doseManagementState = useSelector<ApplicationState, DoseManagementStore.DoseManagementState | undefined>(state => state.doseManagement);
  const dispatch = useDispatch();

  const loadDoses = () => {
    dispatch(actionCreators.loadDosesFromApi());
  };

  return (
    <section className="section-padding" id="dosemanagement">
      <h1>Doses {doseManagementState?.dosesLoaded ? 'loaded' : 'NOT loaded'}</h1>
      <h5>Doses: {doseManagementState?.dosesAreLoading ? 'are loading' : 'are NOT loading'}</h5>
      <button className="btn btn-primary" onClick={loadDoses}>load doses</button>

      {doseManagementState?.dosesLoaded ? <DoseTable doses={doseManagementState?.doses }/> : ''}
    </section>
  );
}

export default DoseManagement;