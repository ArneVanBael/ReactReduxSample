import * as React from 'react';
import {Modal, Button, Form, FormControl} from 'react-bootstrap';
import { Dose } from '../doseManagementStore';
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux';
import * as doseManagementStore from '../doseManagementStore';

type DoseAdjustModalProps = {
    dose?: Dose,
    show?: boolean,
    onHide: any
}

const DoseAdjustmentModal = (props : DoseAdjustModalProps) =>{
    return(
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Dosis aanpassen
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Maak hier aanpassingen aan de dosis</h4>
                <DoseForm dose={props.dose}/>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

type DoseFormProps = {
    dose?: Dose
}
type RBRef = (string & ((ref: Element | null) => void));
const DoseForm = (props: DoseFormProps) => {
    const dispatch = useDispatch();

    const { register, handleSubmit, errors } = useForm<Dose>({
        defaultValues: props.dose
    });

    const onSubmit = (data:Dose) => {
        let updatedDose: Dose = {...props.dose, hp10Dose: data.hp10Dose, remark: data.remark} as Dose;
        dispatch(doseManagementStore.actionCreators.updateDose(updatedDose));
    } 

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="remark">
                <Form.Label>Opmerking</Form.Label>
                <Form.Control 
                    ref={register({ required: true}) as RBRef} 
                    type="text" 
                    name="remark"  
                    isInvalid={!!errors.remark}/>

                <Form.Control.Feedback type={'invalid'}>Opmerking is verplicht!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="hp10Dose">
                <Form.Label>Hp10Dose</Form.Label>
                <Form.Control ref={register} type="number" step={0.01} name="hp10Dose" />
            </Form.Group>
            <Button variant="success" type="submit">
                Submit
            </Button>
        </Form>
    );
}

export default DoseAdjustmentModal;