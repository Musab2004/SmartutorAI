import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	Tabs,
	Tab,
	Button,
	Row,
	Col,
	Modal,
	Container,
	Alert,
	ButtonGroup,
	Form,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Sidebar from "./sidebar";
import DashBoardNavbar from "./DashBoardNavbar";
import DisscusionForum from "./DisscusionForum";
import ResourcePreview from "./ResourcePreview";
import QuizRoomList from "./QuizRoomList";
import { UserContext } from "../landing_page_component/UserContext";
import userService from "../landing_page_component/UserSerive";
import StudyPlanSettings from "./StudyPlanSettings";
// import { Link,useNavigate } from 'react-router-dom';
import { Editor } from "@tinymce/tinymce-react";
import Footer from "../landing_page_component/footer";
import DashboardTabs from "./Dashbaord_tabs";
import Quiz from "./Quiz";
import DatePicker from "react-datepicker";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import { TimePicker } from "react-ios-time-picker";
import LoaderScreen from '../HomePage/LoaderScreen';
const StylishTabs = () => {
	const navigate = useNavigate();
	const { userData } = useContext(UserContext);
	const [activeButton, setActiveButton] = useState("tab2");
	const [loading, setLoading] = useState(false);
	const [alert, setAlert] = useState({ show: false, variant: "", message: "" });
	const location = useLocation();
	const studyPlan = location.state?.studyPlan;
	const book_id = studyPlan.books[0];
	console.log(studyPlan);

	if (!studyPlan) {
		navigate("/homepage");
	}
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			console.log("token does'nt exit : ", localStorage);

			navigate("/");
		}
	}, []);


	const handleClick = (tab, path) => {
		setActiveButton(tab);
		navigate(path, {
			state: {
				studyPlan,
			},
		});
	};


	const [numQuestions, setNumQuestions] = useState("5");
	const [quizType, setQuizType] = useState("MCQ");
	const [instruction, setInstruction] = useState("");
	
	useEffect(() => {
	
		fetchTopics();
	}, []);

	const [topics, settopics] = useState();

	const fetchTopics = async () => {
		try {
			const response = await userService.get("api/topics/", {
				params: {
					book_id: book_id,
				},
			});

			settopics(response.data);
			console.log(response.data);
		} catch (error) {
			console.error("Error:", error);
		}
	};
	const [selectedOption, setSelectedOption] = useState([]);

	// Handler for when options are selected
	const handleChange = (selectedOption) => {
		setSelectedOption(selectedOption);
		console.log(`Option selected:`, selectedOption);
	};
	var options = [];
	console.log(typeof topics, Array.isArray(topics));

	if (topics) {
		let topicses = JSON.parse(topics);
		console.log("topics are her : ", topicses);
		options = Array.isArray(topicses)
			? topicses.map((topic) => ({
					value: topic.pk,
					label: topic.fields.title,
			  }))
			: [];
	}
	const fetchTopic = async (pk) => {
		try {
		  const response = await userService.get(`api/topics/${pk}/`);
		  return response.data;
		} catch (error) {
		  console.error("Error:", error);
		  return error;
		}
	  };
	  function partition(id, title, text) {
		const words = text.split(' ');
		const totalWords = words.length;
		const partitions = [];
		const minWordsPerPartition = 50;
		const maxWordsPerPartition = 100;
		let currentStart = 0;
	
		while (currentStart < totalWords) {
			let endIndex = currentStart + maxWordsPerPartition;
			if (endIndex > totalWords) {
				endIndex = totalWords;
			}
			if (endIndex - currentStart < minWordsPerPartition) {
				endIndex = totalWords;
			}
	
			const partition = {
				id: id,
				title: title,
				content: words.slice(currentStart, endIndex).join(' ')
			};
	
			partitions.push(partition);
			currentStart = endIndex;
		}
	
		return partitions;
	}
	
	const alpaca_prompt = `Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.
	
	### Instruction:
	{}
	
	### Input:
	{}
	
	### Response:
	{}`;
	
	async function generateShortQA(id, title, content, Id) {
		const mcqOutput = [];
		const outputText = await generateMCQsForPartition(content);
		if (quizType === 'ShortQA') {
		const pattern = /<question>(.*?)<\/question>.*?<answer>(.*?)<\/answer>/gs;
		const matches = [...outputText.matchAll(pattern)];
	    console.log(matches)
		for (const match of matches) {
			const question = match[1].trim();
			const correctAnswer = match[2].trim();
			mcqOutput.push({
				id: id,
				Id: Id,
				context: content,
				title: title,
				distractors: null,
				question: question,
				correct_answer: correctAnswer
			});
		}
	
		return mcqOutput;
	}
	else{

		const allQuestions = [];
        console.log("output text : ",outputText);
		const mcqPattern = /<question>(.*?)<\/question>.*?<answer>(.*?)<\/answer>.*?<distractor>(.*?)<\/distractor>/gs;
		const matches = [...outputText.matchAll(mcqPattern)];
		
			for (const match of matches) {
				const [_, question, answer, distractors] = match;
				allQuestions.push({
					id: id,
					Id: Id,
					context: content,
					title: title,
					question: question.trim(),
					correct_answer: answer.trim(),
					distractors: distractors.split('<d>').filter(d => d.trim()).map(d => d.replace('</d>', '').trim())
				});
			}
		
			return allQuestions;
		}



	}
	
	
	async function generateMCQsForPartition(partition, instruction = "Generate Biology based Short qa from it") {
		const inputs = alpaca_prompt.replace('{}', instruction).replace('{}', partition).replace('{}', '')
		console.log("Quiz type : ",quizType);
		if (quizType === 'MCQ') {
			try {
				const response = await axios.post('https://2114-34-126-68-193.ngrok-free.app/generate-questions/', {
					input_text: inputs
				});
				return response.data.results;
			} catch (error) {
				console.error('Error:', error);
				throw error;
			}
			}
			else{
				try {
					const response = await axios.post('https://cfc1-34-125-125-169.ngrok-free.app/generate-questions/', {
						input_text: inputs
					});
					return response.data.results;
				} catch (error) {
					console.error('Error:', error);
					throw error;
				}
			
			
			}
	}
	
	
	async function createQuestions(topics) {
		try {
			const results = [];
			const allPartitions = [];
	
			console.log("started");
	        console.log(topics);
			topics.topics.forEach(topic => {
				const parts = partition(topic.id, topic.title, topic.content);
				allPartitions.push(...parts);
			});
	
			const numSamples = Math.min(parseInt(numQuestions), allPartitions.length);
			const selectedPartitions = allPartitions.sort(() => 0.5 - Math.random()).slice(0, numSamples);
	
			console.log("slected partitions : ",selectedPartitions);
	        let newId=0
			for (const topic of selectedPartitions) {
				const questions = await generateShortQA(topic.id, topic.title, topic.content, newId); // Await the API call
				newId++;
				console.log("questions : ",questions);
				results.push(...questions);
			}
	
			return results;
		} catch (e) {
			throw new Error(e.message);
		}
	}


	  const startQuiz = async (topics) => {	
        setLoading(true);
		const generatedQuestions = await createQuestions({ topics: topics });
		
		navigate("/singlequiz", {state:{quizes:generatedQuestions, numQuestions, quizType,is_mcq:quizType==="MCQ" ? true : false}});	
		 
		}


	const GenerateQuiz = async () => {
		console.log("selectedOption", selectedOption);
		console.log("numQuestions", numQuestions);
		console.log("quizType", quizType);
		const summaries = await Promise.all(
			selectedOption.map(option =>
			  fetchTopic(option.value).then(response => ({
				title: response.title,
				id: response.id,
				content: response.content,  // replace 'summary' with the actual key in the response
			  }))
			)
		  );

         startQuiz(summaries);
		

	};
	return (
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
			{!loading && (<DashBoardNavbar />)}
			{loading && (<LoaderScreen />)}
			{alert.show && (
				<Alert
					variant={alert.variant}
					style={{
						marginTop: "50px",
						position: "fixed",
						zIndex: 9999,
						top: 0,
						right: 0,
						left: 0,
					}}
					onClose={() => setAlert({ ...alert, show: false })}
					dismissible
				>
					{alert.message}
				</Alert>
			)}
		{!loading && (
    <>
        <div style={{ marginTop: "100px", backgroundColor: "#e1efff" }}>
            <DashboardTabs studyPlan={studyPlan} activeButton={activeButton} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <Container style={{ backgroundColor: "white" }}>
                <Form>
                    <label htmlFor="flavors">Select topics</label>
                    <Select
                        isMulti
                        name="flavors"
                        options={options}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleChange}
                        value={selectedOption}
                    />
                    <Form.Group controlId="formNumQuestions">
                        <Form.Label>Number of Questions</Form.Label>
                        <Form.Control as="select" onChange={(e) => setNumQuestions(e.target.value)}>
                            <option value="5">5 questions</option>
                            <option value="10">10 questions</option>
                            <option value="15">15 questions</option>
                            <option value="20">20 questions</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formQuizType">
                        <Form.Label>Quiz Type</Form.Label>
                        <Form.Control as="select" onChange={(e) => setQuizType(e.target.value)}>
                            <option value="MCQ">MCQ</option>
							<option value="MCQ">MCQ</option>
                            <option value="ShortQA">Short Q/A</option>
                        </Form.Control>
                    </Form.Group>
					
                    <Button variant="primary" onClick={GenerateQuiz} >
                        Generate Quiz
                    </Button>
                </Form>
            </Container>
        </div>
    </>
// ) : (
//     <LoaderScreen />
)};
</>
	);
};

export default StylishTabs;
