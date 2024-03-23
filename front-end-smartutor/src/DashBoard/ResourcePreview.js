import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tabs, Tab,Button ,Row,Col,Modal,Container} from 'react-bootstrap';
// Bootstrap Icons

const TopicContent = ({ topic }) => {
  // Placeholder content for each topic
  const contentMap = {
    'Topic 1': 'Content for Topic 1 goes here.',
    Quiz: 'Quiz questions and options go here.',
    'Topic 2': 'Content for Topic 2 goes here.',
    // Add more topics as needed
  };

  return <div>{contentMap[topic]}</div>;
};
function ChapterList({ chapters }) {
  const [expandedChapters, setExpandedChapters] = useState({});

  const toggleTopics = chapterId => {
    setExpandedChapters(prevState => ({
      ...prevState,
      [chapterId]: !prevState[chapterId]
    }));
  };

  return (
    <div>
      <h2>List of Chapters</h2>
      <ul>
        {chapters.map(chapter => (
          <li key={chapter.chapter_id}>
            <Button
              onClick={() => toggleTopics(chapter.chapter_id)}
              style={{ fontWeight: 'bold',backgroundColor:'grey',borderColor:'black' ,height:'70px',width:'300px'}}
            >
              {chapter.chapter_name}
            </Button>
            {expandedChapters[chapter.chapter_id] && (
              <ul>
                {chapter.topics.map(topic => (
                  <li>{topic.title}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
const Sidebar = (props) => {
  console.log(props)
  // const response=props.value.bookdata
  // console.log(response)
  
  const [bookChapters, setBookChapters] = useState([
  ]);
  const chapters_data=props.bookdata.chapters_details
  console.log(chapters_data)

  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleChapterClick = (chapterId) => {
    const updatedChapters = bookChapters.map((chapter) => {
      if (chapter.id === chapterId) {
        return { ...chapter, isOpen: !chapter.isOpen };
      } else {
        return { ...chapter, isOpen: false };
      }
    });
    setBookChapters(updatedChapters);
    setSelectedTopic(null); // Reset selected topic when a chapter is clicked
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="col-md-3 d-none d-md-block bg-light sidebar">
          <div className="sidebar-sticky">
          {chapters_data && <ChapterList chapters={chapters_data} />}
        
          </div>
        </nav>
    </div>
    </div>
  );
};

export default Sidebar;
