import React, { useCallback, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { FiZoomIn } from 'react-icons/fi';
import { AiOutlineSolution } from 'react-icons/ai';

import Person from '../../components/Person/Person.jsx';

import PersonService from '../../http/Person';

import { useProducts } from '../../hooks/products';
import { useEffect } from 'react';

function SearchPeople({ label, type, ...rest }) {
    const { setCustomer, setSeller } = useProducts();
    const [personField, setPersonField] = useState('');
    const [person, setPerson] = useState({});
    const [show, setShow] = useState(false);

    const handleClose = useCallback(() => setShow(false), []);
    const handleShow = useCallback(() => setShow(true), []);

    const handleChange = useCallback((e) => {
        setPersonField(e.target.value);
    }, []);

    const handleBlur = useCallback((e) => {
        const stringSearched = e.target.value.toUpperCase();

        const regexSearch = stringSearched.match(/^\d+$/);

        let queryString = ``;

        if (regexSearch) {
            queryString = `id=${stringSearched}`;
        } else {
            queryString = `razao_social_nome=${stringSearched}`;
        }

        const person = new PersonService();

        person.get(queryString).then(response => {
            if (response.data.length === 1) {
                setPerson(response.data[0]);
                setPersonField(response.data[0].razao_social_nome);

                /**
                 * Nesse trecho precisamos setar o nome do vendedor no segundo input e forçar o evento de clique no botão.
                 */
                if (type === "customer") {
                    document.querySelectorAll("input:nth-child(2)")[1].value = response.data[0].interno.razao_social_nome;

                    setTimeout(() => {
                        document.querySelector("button").click();
                        setShow(false);
                    }, 1000);

                    setShow(false);
                }
            } else {
                setShow(true);
            }
        });
    }, [type]);

    const informeParent = (selectedPerson) => {
        setPerson(selectedPerson);
        setPersonField(selectedPerson.razao_social_nome);
        handleClose();
    };

    useEffect(() => {
        if (type.toLowerCase() === 'customer') {
            setCustomer(person);
        } else if (type.toLowerCase() === 'seller') {
            setSeller(person);
        }
    }, [person, type, setCustomer, setSeller]);

    return (
        <>
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Dados para a Busca</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Person informeParent={informeParent} />
                </Modal.Body>
            </Modal>

            <Form.Group as={Form.Col}>
                <Form.Label className="mr-2">{label}</Form.Label>
                <Form.Control type="text" placeholder={`Informe o ${label}`} {...rest} onBlur={handleBlur} onChange={handleChange} value={personField} />
            </Form.Group>

            <Form.Group className="d-flex align-items-end mr-1">
                <span onClick={handleShow}>
                    <h3> <FiZoomIn /></h3>
                </span>
                <h3> <AiOutlineSolution /></h3>
            </Form.Group>
        </>
    );
}

export default SearchPeople;