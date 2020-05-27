import React from 'react';
import './AssessmentHistoryTable.css'

function AssessmentHistoryTable() {
    return (
        <div>

             <table>    
                 <div> 
                            <tr className="table-head">
                            <td>Batch</td>
                            <td>Date Composed</td>
                            <td>No of Questions</td>
                            <td>Time Allocated</td>
                            <td>Status</td>
                            </tr>
                       <tr className="table-body">
                           <td>Batch 1</td>
                           <td>12/07/94</td>
                           <td>30</td>
                           <td>30 mins</td>
                           <td>Taken</td>
                       </tr>
                       <tr className="table-body">
                           <td>Batch 1</td>
                           <td>12/07/94</td>
                           <td>30</td>
                           <td>30 mins</td>
                           <td>Taken</td>
                       </tr>
                       <tr className="table-body">
                           <td>Batch 1</td>
                           <td>12/07/94</td>
                           <td>30</td>
                           <td>30 mins</td>
                           <td>Taken</td>
                       </tr>
                       </div>
                   </table>
        </div>
    )
}

export default AssessmentHistoryTable;
