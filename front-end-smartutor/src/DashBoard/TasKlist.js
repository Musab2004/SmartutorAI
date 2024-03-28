import React from 'react';
import Weekicon from './week-icon.png'
const TaskList = ({ tasks }) => {
  return (
    
    <section className=" gradient-custom-2">
      <div className="container">
   

            <div className="card mask-custom">
              <div className="card-body p-4 text-white">


                <table className="table text-white mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Week No.</th>
                      <th scope="col">Topics Completed </th>
                      <th scope="col">Feedback</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.response && tasks.response.map((task, index) => (
                      <tr className="fw-normal" key={index}>
                        <th>
                          <img src={Weekicon} alt={`avatar ${index}`} style={{ width: '45px', height: 'auto' }} />
                          <span className="ms-2">Week {task.weekly_goals.order}</span>
                        </th>
                        <td className="align-middle">{task.weekly_goals.topics_covered.length}</td>
                        <td className="align-middle">
                          <h6 className="mb-0"><span className={`badge ${task.priorityClass}`}>{task.priority}</span></h6>
                        </td>
                        <td className="align-middle">
                        <a href="#!" data-mdb-toggle="tooltip" title={task.is_completed ? "Done" : "Pending"}>
  <i className={`fas fa-lg me-3 ${task.weekly_goals.is_completed ? "fa-check text-success" : "fas fa-clock text-primary"}`}></i>
</a>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
         
        </div>
      </div>
    </section>
  );
};

export default TaskList;
