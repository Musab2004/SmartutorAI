import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, FormControl, Button } from 'react-bootstrap';
// import './App.css';
import Navbar from "./HomePageNavbar"
import AllStudyPlans from './AllStudyPlans';
import userService from '../landing_page_component/UserSerive';
import Footer from "../landing_page_component/footer"
const CardList = ({ filteredCards }) => {
  return (
    <Col md={8}>
      {filteredCards.map((card) => (
        <div key={card.id} className="card mb-3">
          <div className="card-body">
         
            <h5 className="card-title">{card.title}</h5>
            {/* Add other card details as needed */}
          </div>
        </div>
      ))}
    </Col>
  );
};

const SearchBar = ({ handleSearch, handleFilterChange }) => {
  return (
    <Form className="mb-3">
      <FormControl
        type="text"
        placeholder="Search..."
        className="mb-2 mr-sm-2"
        onChange={handleSearch}
      />
 
      {/* Add other filter options */}
      <Button variant="primary" className="mb-2">Search</Button>
    </Form>
  );
};

const Filters = ({ handleFilterChange }) => {
    return (
      <Col md={4}>
        <h3>Filters</h3>
        <Form.Group>
          <Form.Label>Location</Form.Label>
          <Form.Control as="select" onChange={(e) => handleFilterChange('location', e.target.value)}>
            <option value="">All Academic Level</option>
            <option value="Middle School">Middle School</option>
    <option value="High School">High School</option>
    <option value="High School">Higher Education</option>
            {/* Add other location options */}
          </Form.Control>
        </Form.Group>
  
        <Form.Group>
          <Form.Label>Subjects</Form.Label>
          <Form.Control as="select" onChange={(e) => handleFilterChange('subject', e.target.value)}>
            <option value="">All Subjects</option>
            <option value="Physics">Physics</option>
    <option value="Chemistry">Chemistry</option>
    <option value="Geography">Geography</option>
    <option value="History">History</option>
    <option value="English">English</option>
            {/* Add other subject options */}
          </Form.Control>
        </Form.Group>
  
        <Form.Group>
          <Form.Label>Date</Form.Label>
          <Form.Control type="date" onChange={(e) => handleFilterChange('date', e.target.value)} />
        </Form.Group>
  
        <Form.Group>
          <Form.Label>Number of Members</Form.Label>
          <Form.Control type="number" onChange={(e) => handleFilterChange('members', e.target.value)} />
        </Form.Group>
      </Col>
    );
  };

const App = () => {
  const [activeTab, setActiveTab] = useState("explore-courses");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.get('/api/studyplans/'); // Your Django endpoint to fetch users
        
        console.log(response.data)
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    fetchUsers();
  }, []);
 
  const [cards, setCards] = useState([]); // Your card data
  const [filteredCards, setFilteredCards] = useState(cards);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    subject: '',
    // Add other filters here (date, number of members)
  });

  useEffect(() => {
    const filtered = cards.filter((card) => {
      console.log(card)
      return (
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filters.location === '' || card.academic_level === filters.location) &&
        (filters.subject === '' || card.subject === filters.subject)
        // Add other filter conditions here
      );
    });

    setFilteredCards(filtered);
  }, [cards, searchTerm, filters]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({ ...filters, [filterType]: value });
  };

  return (
    // <Container>
    <>
        <style>
    {`
      body {
        background-color: #e1efff; /* Set the background color to blue */
        margin: 0; /* Reset margin for the body */
        padding: 0; /* Reset padding for the body */
      }
    `}
  </style>
  <></>
    {posts.length === 0 ? (
      <>
      <Navbar activeTab={activeTab} />
      <div style={{ textAlign: 'center', marginTop: '20%' }}>
        <h3>No study plans available</h3>
        {/* You can add additional text or a message here */}
      </div>
      </>
    ) : (
      <>
            <Navbar activeTab={activeTab} />

      
        <AllStudyPlans studyPlans={posts} itemsPerPage={12} /> 
        </>
    )}
      <footer className="bg-light text-lg-start" style={{marginTop:'100px'}}>
       <Footer/>
      </footer>
    </>
    // </Container>
  );
};

export default App;
