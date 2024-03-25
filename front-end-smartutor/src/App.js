import { BrowserRouter, Route, Routes } from "react-router-dom";

import LogoutButton from "./LogoutButton";

import LandingPage from "./landing_page_component/LandinPage";
import QuizPage from "./landing_page_component/QuizPage";
import SummaryGenPage from "./landing_page_component/SummaryGenPage";
import CreateStudyPlan from "./HomePage/CreateStudyPlans";
import SearchStudyPlans from "./HomePage/SearchStudyPlans";
import MyStudyPlans from "./HomePage/MyCourses";
import HomePage from "./HomePage/Homepage";
import TimetableMaker from "./HomePage/TimetableMaker";
import Joined_TimeTableMaker from "./HomePage/Joined_TimeTableMaker";
import ProfilePage from "./HomePage/ProfilePage";
import PrivateRoute from "./landing_page_component/PrivateRoute";
import TimeTableFinal from "./HomePage/TimeTableFinal";
// import UserProfile from './UserProfile';
// import UpdateProfileForm from './UpdateProfileForm';
import DashBoard from "./DashBoard/dashboard";
import DisscusionForumDashBoard from "./DashBoard/QueryPlatform";
import SummaryGenerationDashBoard from "./DashBoard/SummaryGeneration";
import QuizGenerationDashBoard from "./DashBoard/QuizGeneration";
import SettingsDashBoard from "./DashBoard/StudyPlanSettings";
import DashBoardQuizRoom from "./DashBoard/QuizRoom";
import UserProvider from "./landing_page_component/UserContext";

function App() {
	return (
		<UserProvider>
			<div style={{ backgroundColor: "#e1efff" }}>
				<BrowserRouter>
					{/* <LandingPage /> */}
					<Routes>
						<Route exact path="" element={<LandingPage />} />
						{/* <Route path="/login" component={LoginForm} /> */}
						{/* <Route path="/logout" component={LogoutButton} />
          <Route path="/signup" component={SignupForm} /> */}
						{/* <Route path="/profile" component={UserProfile} />
          <Route path="/update-profile" component={UpdateProfileForm} /> */}
						<Route exact path="/profile" element={<ProfilePage />} />
						<Route exact path="/createstudyplan" element={<CreateStudyPlan />} />
						<Route exact path="/dashboard-settings" element={<SettingsDashBoard />} />
						<Route exact path="/dashboard" element={<DashBoard />} />
						<Route
							exact
							path="/dashboard-summary-generation"
							element={<SummaryGenerationDashBoard />}
						/>
						<Route exact path="/dashboard-quiz-generation" element={<QuizGenerationDashBoard />} />
						<Route exact path="/dashboard-quiz-room" element={<DashBoardQuizRoom />} />
						<Route
							exact
							path="/dashboard-discussion-forum"
							element={<DisscusionForumDashBoard />}
						/>
						<Route exact path="/homepage" element={<HomePage />} />
						<Route exact path="/quiz" element={<QuizPage />} />
						<Route exact path="/summary" element={<SummaryGenPage />} />
						<Route exact path="/createstudyplan" element={<CreateStudyPlan />} />
						<Route exact path="/my-courses" element={<MyStudyPlans />} />
						<Route exact path="/explore-courses" element={<SearchStudyPlans />} />
						<Route exact path="/maketimetable" element={<TimetableMaker />} />
						<Route exact path="/finalstep" element={<TimeTableFinal />} />
						<Route exact path="/dashboard/post" element={<Post />} />
					</Routes>
				</BrowserRouter>
			</div>
		</UserProvider>
	);
}

export default App;
