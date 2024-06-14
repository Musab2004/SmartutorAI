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
import axios from "axios";
import Sidebar from "./sidebar";
import DashBoardNavbar from "./DashBoardNavbar";
import DisscusionForum from "./DisscusionForum";
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
import LoaderScreen from "../HomePage/LoaderScreen";

const StylishTabs = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);
  const [activeButton, setActiveButton] = useState("tab2");
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({ show: false, variant: "", message: "" });
  const location = useLocation();
  const studyPlan = location.state?.studyPlan;
  const book_id = studyPlan.books[0];

  if (!studyPlan) {
    navigate("/homepage");
  }
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
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
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const [selectedOption, setSelectedOption] = useState([]);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };
  var options = [];

  if (topics) {
    let topicses = JSON.parse(topics);
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

  async function getExplanation(question, answer) {
    const apiKey = "sk-proj-H9604idDPtL8XzensAebT3BlbkFJkPTrLzW1LgpMkpPCqmLp";
    const endpoint = "https://api.openai.com/v1/chat/completions";

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    const data = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `Question: ${question}\nAnswer: ${answer}\nExplain this in simple and understandable terms.`,
        },
      ],
      max_tokens: 150,
    };

    try {
      const response = await axios.post(endpoint, data, { headers });
      const explanation = response.data.choices[0].message.content.trim();
      return explanation;
    } catch (error) {
      console.error("Error making API call:", error);
      // throw error;
    }
  }
  function partition(id, title, text) {
    const words = text.split(" ");
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
        content: words.slice(currentStart, endIndex).join(" "),
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
    if (quizType === "ShortQA") {
      const pattern = /<question>(.*?)<\/question>.*?<answer>(.*?)<\/answer>/gs;
      const matches = [...outputText.matchAll(pattern)];
      for (const match of matches) {
        const question = match[1].trim();
        const correctAnswer = match[2].trim();
        const explanation = await getExplanation(question, correctAnswer);
        mcqOutput.push({
          id: id,
          Id: Id,
          context: content,
          title: title,
          distractors: null,
          question: question,
          correct_answer: correctAnswer,
          explanation: explanation,
        });
      }

      return mcqOutput;
    } else {
      const allQuestions = [];
      const mcqPattern =
        /<question>(.*?)<\/question>.*?<answer>(.*?)<\/answer>.*?<distractor>(.*?)<\/distractor>/gs;
      const matches = [...outputText.matchAll(mcqPattern)];

      for (const match of matches) {
        const [_, question, answer, distractors] = match;
        const explanation = await getExplanation(question, answer.trim());
		const distractors1=distractors.split("<d>").filter((d) => d.trim()).map((d) => d.replace("</d>", "").trim())
        const uniqueDistractors = [...new Set(distractors1)];
        if (uniqueDistractors.length > 1) {
        
		allQuestions.push({
          id: id,
          Id: Id,
          context: content,
          title: title,
          question: question.trim(),
          correct_answer: answer.trim().replace(/^[a-zA-Z]\.\s*/, ""),
          distractors: uniqueDistractors ,
          explanation: explanation,
        });
      }
      }

      return allQuestions;
    }
  }

  async function generateMCQsForPartition(
    partition,
    instruction = "Generate Biology based Short qa from it"
  ) {
    const inputs = alpaca_prompt
      .replace("{}", instruction)
      .replace("{}", partition)
      .replace("{}", "");
    if (quizType === "MCQ") {
      try {
        const response = await axios.post(
          "https://6e66-34-87-159-172.ngrok-free.app/generate-questions/",
          {
            input_text: inputs,
          }
        );
        return response.data.results;
      } catch (error) {
        console.error("Error:", error);
        // throw error;
      }
    } else {
      try {
        const response = await axios.post(
          "https://4233-35-204-226-215.ngrok-free.app/generate-questions/",
          {
			// "inputs":"",
            input_text: inputs,
		
        //   },  {
		// 	headers: {
		// 	  Authorization: `Bearer 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`,
		// 	  'Accept': 'application/json'
		// 	}
		  }
        );
		console.log("response : ",response)
        return response.data[0].generated_text;
      } catch (error) {
        console.error("Error:", error);
        // throw error;
      }
    }
  }

  async function createQuestions(topics) {
    try {
      const results = [];
      const allPartitions = [];
      topics.topics.forEach((topic) => {
        const parts = partition(topic.id, topic.title, topic.content);
        allPartitions.push(...parts);
      });

      const partitionSize = numQuestions / topics.topics.length; // Equal number of samples from each partition
      let selectedPartitions = [];
      // Group partitions by partitionId
      const partitionsById = allPartitions.reduce((acc, partition) => {
        if (!acc[partition.partitionId]) {
          acc[partition.partitionId] = [];
        }
        acc[partition.partitionId].push(partition);
        return acc;
      }, {});

      // Randomly shuffle an array
      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }
      for (const partitionId in partitionsById) {
        const shuffledPartitions = shuffle(partitionsById[partitionId]);
        selectedPartitions.push(...shuffledPartitions.slice(0, partitionSize));
      }

      // Ensure the total selected samples is as required
      if (selectedPartitions.length > numQuestions) {
        selectedPartitions.length = numQuestions;
      }
      const numSamples = Math.min(
        parseInt(numQuestions),
        allPartitions.length
      );
      selectedPartitions = allPartitions
        .sort(() => 0.5 - Math.random())
        .slice(0, numSamples);
      let newId = 0;
      for (const topic of selectedPartitions) {
        const questions = await generateShortQA(
          topic.id,
          topic.title,
          topic.content,
          newId
        ); // Await the API call
        newId++;
        results.push(...questions);
      }

      return results;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  const startQuiz = async (topics) => {
    try {
      setLoading(true);
      const generatedQuestions = await createQuestions({ topics: topics });
      navigate("/singlequiz", {
        state: {
          quizes: generatedQuestions,
          numQuestions,
          quizType,
		  studyPlan,
          is_mcq: quizType === "MCQ" ? true : false,
        },
      });
    } catch (error) {
      throw error;
      //   alert(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const GenerateQuiz = async () => {
    const summaries = await Promise.all(
      selectedOption.map((option) =>
        fetchTopic(option.value).then((response) => ({
          title: response.title,
          id: response.id,
          content: response.content, // replace 'summary' with the actual key in the response
        }))
      )
    );

    startQuiz(summaries);
  };

  const blurStyle = loading ? { filter: "blur(5px)", pointerEvents: "none" } : {};
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
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
      {loading && (
        <div style={overlayStyle}>
          <LoaderScreen mesg="It may take 5-10 min to Generate Quiz " />
        </div>
      )}

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
      <div style={blurStyle}>
        <div style={{ marginTop: "100px", backgroundColor: "#e1efff" }}>
          <DashboardTabs studyPlan={studyPlan} activeButton={activeButton} />
        </div>
        <h1 style={{ textAlign: "center", color: "#1f5692" }}>
          Create Quizes According to your topic here
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <Container style={{ padding: "50px", backgroundColor: "white", borderRadius: "15px" }}>
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
                <Form.Control
                  as="select"
                  onChange={(e) => setNumQuestions(e.target.value)}
                >
                  <option value="5">5 questions</option>
                  <option value="10">10 questions</option>
                  <option value="15">15 questions</option>
                  <option value="20">20 questions</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formQuizType">
                <Form.Label>Quiz Type</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setQuizType(e.target.value)}
                >
                  <option value="MCQ">MCQ</option>
                  <option value="ShortQA">Short Q/A</option>
                </Form.Control>
              </Form.Group>

              <Button
                variant="primary"
                onClick={GenerateQuiz}
                style={{ marginTop: "20px", marginLeft: "40%" }}
              >
                Generate Quiz
              </Button>
            </Form>
          </Container>
        </div>
      </div>
    </>
  );
};

export default StylishTabs;
