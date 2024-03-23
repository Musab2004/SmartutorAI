import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Row, Col, Pagination } from 'react-bootstrap';
import { UserContext } from '../landing_page_component/UserContext';
import userService from '../landing_page_component/UserSerive';
import { useNavigate } from 'react-router-dom';

const StudyPlans = ({ itemsPerPage }) => {
  const { userData } = useContext(UserContext);
  const [studyPlans, setStudyPlans] = useState([]);
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);

  useEffect(() => {
    const fetchStudyPlans = async () => {
      try {
        const response = await userService.get(`/api/ongoingstudyplans/?user_id=${userData.pk}`);
        setStudyPlans(response.data);
      } catch (error) {
        console.error('Failed to fetch study plans', error);
        // Handle error or redirect if needed
      }
    };

    fetchStudyPlans();
  }, []);

  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudyPlans = studyPlans.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(studyPlans.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleGoToStudyPlan = (studyPlan) => {
    navigate('/dashboard', { state: { studyPlan } });
  };

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
            <Card key={index} style={{ width: '60%', marginLeft: '15%', marginTop: '10px' }}>
              <Row>
                <Col sm={4}>
                  <Card.Img variant="top" style={{ width: '100%', height: '150px', marginTop: '0px' }} src={studyPlan.image} />
                </Col>
                <Col sm={8}>
                  <Card.Body style={{ textAlign: 'left' }}>
                    <Card.Title style={{ color: 'black' }}>{studyPlan.name}</Card.Title>
                    <Card.Subtitle style={{ color: 'black' }} className="mb-2 text-muted">{studyPlan.schedule}</Card.Subtitle>
                    <Card.Text style={{ color: 'black' }}>{studyPlan.subject}</Card.Text>
                    <Button variant="primary" style={{backgroundColor:'#1f5692',borderColor:'#1f5692'}}onClick={() => handleGoToStudyPlan(studyPlan)}>
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
