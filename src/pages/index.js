import React from "react"
import { useQuery, useMutation } from '@apollo/client'
import gql from 'graphql-tag'

import Layout from "../components/layout"
import SEO from "../components/seo"

const GET_TODO = gql`
{
        todos{
            id
            task
            status
        }
    }
`;

const ADD_TODO = gql`
    mutation addTodo($task: String!, $status: Boolean!){
        addTodo(task: $task, status: $status){
            task
            status
        }
    }
`

const IndexPage = () => {
    const [status, setStatus] = React.useState(false);
    const { loading, error, data } = useQuery(GET_TODO);
    let inputText;
    const [addTodo] = useMutation(ADD_TODO);
    console.log(status);
    const addTask = () => {
        addTodo({
            variables: {
                task: inputText.value,
                status: status
            },
            refetchQueries: [{ query: GET_TODO }]
        })
    }

    if (loading) {
        return <div>loading...</div>
    }

    if (error) {
        console.log(error)
        return <div>Error</div>
    }

    return (
        <Layout>
            <SEO title="Home" />
            <div>
                <div style={{ width: '50%', border: '1px solid #999', padding: '1em', boxShadow: '3px 3px 3px #ccc', background: 'linen', margin: '1em auto'}}>
                    <h2>Add Todos</h2>
                    <label>
                        Add task
                        <input type="text" ref={node => {
                            inputText = node;
                        }} style={{marginLeft: '1em'}} />
                    </label>
                    <br/>
                    <label>
                        Set status
                        <input type="checkbox" checked={status} onChange={e => setStatus(e.target.checked)} style={{marginLeft: '1em'}} />
                    </label>
                    <br/>
                    <button onClick={addTask} style={{width: '100%'}}>Add Task</button>
                </div>
                <h2>My Todo List</h2>
                <table style={{border: '1px solid #ccc'}} >
                    <thead style={{fontSize: '1.1em', fontWeight: 'bold'}} >
                        <tr>
                            <td>ID</td>
                            <td>Task</td>
                            <td>Status</td>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        data.todos.map((todo, index) => (
                            <tr key={index}>
                                <td>{todo.id}</td>
                                <td>{todo.task}</td>
                                <td>{todo.status ? "Complete" : "Incomplete"}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </Layout>
    )
}
export default IndexPage;
