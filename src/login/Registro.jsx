import axios from "axios";
import { useContext, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/AuthContext";

function Registro() {
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);

    const API_KEY = "AIzaSyBY5z4uU0OUlp9x_ZcaFRICSUe_42GwlOk"; 

    const submitHandler = (event) => {
        event.preventDefault();
        setError(null);

        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };

        // 1. Registro en Firebase Auth
        axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, authData)
            .then((response) => {
                const uid = response.data.localId;
                const idToken = response.data.idToken;

                // Definimos el rol según el email (Lógica para la demo local)
                const userRole = email.endsWith('@eldersense.com') ? 'admin' : 'user';

                const datosDeUsuarioParaBD = {
                    nombre: username,
                    email: email,
                    rol: userRole,
                    fecha_registro: new Date().toLocaleDateString('es-ES'),
                    dispositivos: [] // Array vacío para empezar a vincular ESP32s
                };

                // 2. Guardamos en la base de datos de ElderSense
                return axios.put(`https://eldersense-default-rtdb.europe-west1.firebasedatabase.app/usuarios/${uid}.json?auth=${idToken}`, datosDeUsuarioParaBD)
                    .then(() => {
                        // Guardamos en el contexto incluyendo el ROL
                        authCtx.loginAction(idToken, uid, username, userRole);
                        
                        // Redirección inteligente
                        if (userRole === 'admin') {
                            navigate("/admin-dashboard");
                        } else {
                            navigate("/dashboard");
                        }
                    });
            })
            .catch((err) => {
                const message = err.response?.data?.error?.message || "Error técnico";
                setError(message === "EMAIL_EXISTS" ? "Este correo ya está registrado." : message);
            });
    }

    return (
        <div style={{ backgroundColor: "#f0fdf8", minHeight: "100vh", display: "flex", alignItems: "center" }}>
            <Container>
                <Row className="align-items-center">
                    <Col md={6} className="d-none d-md-block">
                        <Card className="border-0 shadow-lg overflow-hidden" style={{ height: "550px" }}>
                            <Card.Img src="/assets/elderly-care.jpg" style={{ objectFit: "cover", height: "100%" }} />
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="shadow-sm border-0 p-4">
                            <Card.Body>
                                <div className="text-center mb-4">
                                    <span style={{fontSize: '2rem'}}>📶</span>
                                    <h2 className="fw-bold" style={{ color: "#1d9e75" }}>ElderSense</h2>
                                    <p className="text-muted">Crea tu cuenta de cuidador</p>
                                </div>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Form onSubmit={submitHandler}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Nombre Completo</Form.Label>
                                        <Form.Control type="text" placeholder="Ej: Juan Pérez" value={username} onChange={e => setUsername(e.target.value)} required />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Email</Form.Label>
                                        <Form.Control type="email" placeholder="usuario@correo.com" value={email} onChange={e => setEmail(e.target.value)} required />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Contraseña</Form.Label>
                                        <Form.Control type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} required />
                                    </Form.Group>
                                    <Button className="w-100 fw-bold border-0" style={{ backgroundColor: "#1d9e75" }} type="submit">
                                        REGISTRARSE
                                    </Button>
                                    <div className="text-center mt-3">
                                        <small className="text-muted" style={{ cursor: "pointer" }} onClick={() => navigate('/login')}>
                                            ¿Ya tienes cuenta? Inicia sesión
                                        </small>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
export default Registro;