import { useContext, useState } from "react";
import { Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import { AppContext } from "../contexts/AppContext";
import Loader from "./Loader";
import axios from "axios";

export default function UploadForm() {
  const { state, dispatch } = useContext(AppContext);

  // Removidas as chaves da API TMDB, usando apenas o backend local
  const [query, setQuery] = useState("");
  const [releaseYear, setReleaseYear] = useState("");


  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 35 }, (_, i) => currentYear - i).sort((a, b) => b - a);

  const validateSearchInput = (searchQuery) => {
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery && trimmedQuery.length < 2) {
      return 'O título deve ter pelo menos 2 caracteres';
    }

    if (trimmedQuery && trimmedQuery.length > 100) {
      return 'O título é muito longo (máximo 100 caracteres)';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedQuery = query.trim();
    const trimmedYear = releaseYear.trim();

    if (!trimmedQuery && !trimmedYear) {
      return dispatch({ type: "ERROR", payload: "Por favor, digite um Título ou selecione um Ano para a busca." });
    }

    if (trimmedQuery) {
      const validationError = validateSearchInput(trimmedQuery);
      if (validationError) {
        return dispatch({ type: "ERROR", payload: validationError });
      }
    }

    try {
      // Usar SEARCH_START conforme definido em appReducer.js
      dispatch({ type: "SEARCH_START" }); 
      
      const params = {};
      if (trimmedQuery) {
        params.query = trimmedQuery;
      }
      if (trimmedYear) {
        params.ano = trimmedYear;
      }

      // CHAMA A API LOCAL PROTEGIDA: GET /api/filmes
      // O token JWT é enviado automaticamente pelo AuthContext via axios.defaults.headers
      const response = await axios.get('/api/filmes', { params });
      
      // O backend retorna { origem, resultados: [...] }
      const results = response.data.resultados || [];


      if (results.length === 0) {
        dispatch({ type: "ERROR", payload: "Nenhum filme encontrado com os critérios fornecidos no BD local." });
      } else {
        dispatch({ type: "SUCCESS", payload: results });
      }

    } catch (err) {

      const apiErrorData = err.response?.data?.error;
      const errorMessage = apiErrorData?.message || "Falha na comunicação com a API local. Verifique se o backend está rodando (porta 3000).";

      console.error("Local API Error Detail:", apiErrorData || err.message);

      dispatch({ type: "ERROR", payload: errorMessage });
    }
  };

  // Usar 'loading' conforme appReducer.js
  const isSearching = state.status === "loading"; 
  const statusMessage = isSearching ? "Buscando Títulos no BD local..." : "Aguardando Busca...";


  return (
    <Form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow-lg mx-auto" style={{ maxWidth: '700px' }}>

      <h2 className="text-center mb-5 text-primary">Consulta de Filmes (BD Local)</h2>

      {state.status === "error" && <Alert variant="danger">{state.error}</Alert>}

      <Row className="g-3 mb-4 align-items-start">
        <Col md={8}>
          <Form.Group controlId="formQuery">
            <Form.Label>Título do Filme (Opcional)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ex: Matrix, Vingadores, Interestelar..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (state.status === "error") {
                  dispatch({ type: "RESET" });
                }
              }}
              disabled={isSearching}
              isInvalid={state.status === "error" && query.trim().length > 0}
            />
            <Form.Control.Feedback type="invalid">
              {state.error}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={12}>
          <Form.Group controlId="formReleaseYear">
            <Form.Label>Ano de Lançamento (Opcional)</Form.Label>
            <Form.Control
              as="select"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              disabled={isSearching}
            >
              <option value="">Qualquer Ano</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      {/* O Loader agora usa a condição de loading do AppContext */}
      {isSearching && <Loader message={statusMessage} />}

      <Button
        type="submit"
        variant="primary"
        disabled={isSearching || (!query.trim() && !releaseYear.trim())}
        className="w-100 mt-2"
      >
        {isSearching ? (
          <>
            <Spinner animation="border" size="sm" className="me-2" />
            Buscando...
          </>
        ) : (
          "Buscar Filmes"
        )}
      </Button>
    </Form>
  );
}