import { useContext, useState } from "react";
import { Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import { AppContext } from "../contexts/AppContext";
import Loader from "./Loader";
import axios from "axios";

export default function UploadForm() {
  const { state, dispatch } = useContext(AppContext);
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
      dispatch({ type: "UPLOAD_START" });
      
      // Build query params for backend
      const params = {};
      if (trimmedQuery) params.query = trimmedQuery;
      if (trimmedYear) params.ano = trimmedYear;

      // Search from local backend
      const response = await axios.get('/api/filmes', { params });
      const results = response.data.resultados || [];

      if (results.length === 0) {
        dispatch({ type: "ERROR", payload: "Nenhum filme encontrado com os critérios fornecidos." });
      } else {
        // Map backend results to match the expected format
        const mappedResults = results.map(filme => ({
          id: filme._id,
          title: filme.titulo,
          overview: filme.descricao,
          release_date: filme.ano ? `${filme.ano}-01-01` : null,
          vote_average: 0, // Not available in local data
          poster_path: null // Not available in local data
        }));
        dispatch({ type: "SUCCESS", payload: mappedResults });
      }

    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || "Falha na comunicação com o backend.";
      console.error("Backend API Error:", err.response?.data || err.message);
      dispatch({ type: "ERROR", payload: errorMessage });
    }
  };

  const isSearching = state.status === "uploading" || state.status === "processing";
  const statusMessage = state.status === "uploading" ? "Buscando Filmes..." : "Processando Dados...";

  return (
    <Form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow-lg mx-auto" style={{ maxWidth: '700px' }}>

      <h2 className="text-center mb-5 text-primary">Busca de Filmes Locais</h2>

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
