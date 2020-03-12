
import * as React from 'react';
import { Dose } from '../doseManagementStore';
import {Table} from 'react-bootstrap';
import './doseTable.scss';
import DoseAdjustmentModal from '../doseAdjustmentModal/doseAdjustmentModal';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from '../../store';
import * as DoseManagementStore from '../doseManagementStore';

type DoseTableProps = {
    doses: Dose[] | undefined
}

const DoseTable = (props: DoseTableProps) => {
    const doseManagementState = useSelector<ApplicationState, DoseManagementStore.DoseManagementState | undefined>(state => state.doseManagement);
    const dispatch = useDispatch();
    
    const openModal = (dose: Dose) => {
        dispatch(DoseManagementStore.actionCreators.openDoseAdjustmentModal(dose));
    }

    const hideModal = () => {
        dispatch(DoseManagementStore.actionCreators.closeDoseAdjustmentModal());
    }

    return(
        <React.Fragment>
            <Table responsive id="dose-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Hp10Dose</th>
                            <th>Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.doses?.map((item, key) =>
                            <tr className="grow" key={key} onClick = {() => openModal(item)}>
                                <td>{key}</td>
                                <td>{item.date}</td>
                                <td>{item.hp10Dose}</td>
                                <td>{item.remark}</td>
                            </tr>
                        )}
                    </tbody>
            </Table>
            <DoseAdjustmentModal dose={doseManagementState?.selectedDose} show={doseManagementState?.modelOpen} onHide={hideModal}/>
        </React.Fragment>
    );
}

export default DoseTable;