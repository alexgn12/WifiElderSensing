import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import AuthContext from '../../store/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [passwd, setPasswd] = useState('');
    const [error, setError] = useState(null);
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    const API_KEY = "AIzaSyBY5z4uU0OUlp9x_ZcaFRICSUe_42GwlOk";

    const submitHandler = (e) => {
        e.preventDefault();
        setError(null);

        const authData = {
            email: email,
            password: passwd,
            returnSecureToken: true
        };

        // 1. Validar credenciales
        axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, authData)
            .then((res) => {
                const idToken = res.data.idToken;
                const localId = res.data.localId;

                // 2. Obtener datos extra (Nombre y ROL) de la Realtime Database
                axios.get(`https://eldersense-default-rtdb.europe-west1.firebasedatabase.app/usuarios/${localId}.json?auth=${idToken}`)
                    .then((resultado_BD) => {
                        const data = resultado_BD.data;
                        const nombre = data?.nombre || "Usuario";
                        const rol = data?.rol || "user"; // Por defecto cliente

                        // 3. Guardar todo en el contexto
                        authCtx.loginAction(idToken, localId, nombre, rol);

                        // 4. Redirigir según el rol
                        if (rol === 'admin') {
                            navigate('/admin-dashboard');
                        } else {
                            navigate('/dashboard');
                        }
                    })
                    .catch(() => {
                        authCtx.loginAction(idToken, localId, "Usuario", "user");
                        navigate("/dashboard");
                    });
            })
            .catch((err) => {
                setError("Correo o contraseña incorrectos");
            });
    }

    return (
        <div style={{ backgroundColor: "#f0fdf8", minHeight: "100vh", display: "flex", alignItems: "center" }}>
            <Container>
                <Row className="justify-content-center">
                    <Col md={5}>
                        <Card className="border-0 shadow-sm p-4">
                            <Card.Body>
                                <div className="text-center mb-4">
                                    <h1 className="fw-bold" style={{ color: "#1d9e75" }}>ElderSense</h1>
                                    <p className="text-muted small">Monitorización inteligente e invisible</p>
                                </div>
                                {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
                                <Form onSubmit={submitHandler}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small fw-bold">Email</Form.Label>
                                        <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="small fw-bold">Contraseña</Form.Label>
                                        <Form.Control type="password" value={passwd} onChange={e => setPasswd(e.target.value)} required />
                                    </Form.Group>
                                    <Button className="w-100 fw-bold border-0" style={{ backgroundColor: "#1d9e75" }} type="submit">
                                        ENTRAR
                                    </Button>
                                </Form>
                                <div className="text-center mt-4">
                                    <hr />
                                    <small className="text-muted">
                                        ¿Nuevo en ElderSense? <span style={{ color: "#1d9e75", cursor: "pointer" }} onClick={() => navigate('/registro')}>Crea una cuenta</span>
                                    </small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Login;