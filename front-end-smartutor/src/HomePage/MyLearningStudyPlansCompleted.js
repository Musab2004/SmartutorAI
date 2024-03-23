import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Button, Pagination } from 'react-bootstrap';
import { UserContext } from '../landing_page_component/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import userService from '../landing_page_component/UserSerive';

const StudyPlans = ({ studyPlans1, itemsPerPage }) => {
  const { userData } = useContext(UserContext);
  const [studyPlans, setCompletedStudyPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.get(`/api/completedstudyplans/?user_id=${userData.pk}`);
        setCompletedStudyPlans(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch study plans', error);
        setError('Failed to fetch study plans. Please try again later.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleGoToStudyPlan = (studyPlan) => {
    navigate('/dashboard', { state: { studyPlan } });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudyPlans = studyPlans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(studyPlans.length / itemsPerPage);

  return (
    <div className='container'>
      {studyPlans.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h3>No study plans available</h3>
          {/* You can add additional text or a message here */}
        </div>
      ) : (
        <>
          {currentStudyPlans.map((studyPlan, index) => (
            <Card key={index} style={{ width: '80%', marginLeft: '15%', marginTop: '10px' }}>
              <Row>
                <Col sm={4}>
                  <Card.Img variant="top" style={{ width: '300px', height: '150px', marginTop: '0px' }} src={studyPlan.image} />
                </Col>
                <Col sm={8}>
                  <Card.Body style={{ textAlign: 'left' }}>
                    <Card.Title style={{ color: 'blue' }}>{studyPlan.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted" style={{ color: 'blue' }}>{studyPlan.schedule}</Card.Subtitle>
                    <Card.Text style={{ color: 'blue' }}>{studyPlan.subject}</Card.Text>
                    <Button variant="primary" style={{backgroundColor:'#f66b1d'}} onClick={() => handleGoToStudyPlan(studyPlan)}>
                      Go to My Study Plan
                    </Button>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          ))}
          <Pagination className="justify-content-center">
            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === activePage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </div>
  );
};

export default StudyPlans;
