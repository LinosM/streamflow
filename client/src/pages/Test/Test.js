import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { Card } from "../../components/Card";
import { Input, TextArea, FormBtn } from "../../components/Form";
import DeleteBtn from "../../components/DeleteBtn";
import API from "../../utils/API";
import AUTH from '../../utils/AUTH';

function Test() {
  const [projects, setProjects] = useState([]);
  const [formObject, setFormObject] = useState({});
  const formEl = useRef(null);
  const [userInfo, setUserInfo] = useState({});
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    loadAllProjects();
    loadOwnedProjects();
    loadAssignedProjects();
    loadUsers();
    AUTH.getUser().then(res => {
      setUserInfo(res.data.user);
    });
  }, []);

  // -------------------------------------------

  // API.getProjects(param)
  // Leaving param blank will get all projects associated with the logged in user
  // Setting param to "owned" will only get projects created by the logged in user
  // Setting param to "assigned" will only get projects assigned to the logged in user

  function loadAllProjects() {
    API.getProjects()
      .then(res => {
        console.log("all projects: " + JSON.stringify(res.data.projects));
        setProjects(res.data.projects);
      })
      .catch(err => console.log(err));
  }

  function loadOwnedProjects() {
    API.getProjects("owned")
      .then(res => {
        console.log("owned projects : " + JSON.stringify(res.data.projects));
      })
      .catch(err => console.log(err));
  };

  function loadAssignedProjects() {
    API.getProjects("assigned")
      .then(res => {
        console.log("assigned projects : " + JSON.stringify(res.data.projects));
      })
      .catch(err => console.log(err));
  }

  // -------------------------------------------

  // Grabs list of all users in the DB, ready for assigning users to projects/tasks
  function loadUsers() {
    API.getUsers().then(res => {
      console.log(res.data);
      setUserList(res.data);
    })
  }

  // // Deletes a book from the database with a given id, then reloads books from the db
  // function deleteBook(id) {
  //   API.deleteBook(id)
  //     .then(res => loadBooks())
  //     .catch(err => console.log(err));
  // }

  // Handles updating component state when the user types into the input field
  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormObject({...formObject, [name]: value})
  };

  // When the form is submitted, use the API.saveBook method to save the book data
  // Then reload books from the database
  function handleFormSubmit(event) {
    event.preventDefault();
    if (formObject.title && formObject.dueDate) {
      API.saveProject({
        title: formObject.title,
        dueDate: formObject.dueDate,
        owner: {
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            username: userInfo.username,
            id: userInfo._id
        }
      })
        .then(res => {
          formEl.current.reset();
          loadOwnedProjects();
        })
        .catch(err => console.log(err));
    }
  };

    return (
      <Container fluid>
        <Row>
          <Col size="md-6">
            <Card title="Enter Project Information">
              <form ref={formEl}>
                <Input
                  onChange={handleInputChange}
                  name="title"
                  placeholder="Title (required)"
                />
                <Input
                  onChange={handleInputChange}
                  name="dueDate"
                  placeholder="Due Date"
                />
                <FormBtn
                  disabled={!(formObject.dueDate && formObject.title)}
                  onClick={handleFormSubmit}
                >
                  Submit Book
                </FormBtn>
              </form>
            </Card>
          </Col>
          <Col size="md-6 sm-12">
            <Card title="List of projects">
              {projects.length ? (
                <List>
                  {projects.map(projects => (
                    <ListItem key={projects._id}>
                      <Link to={"/projects/" + projects._id}>
                        <strong>
                          {projects.title} due {projects.dueDate} by {projects.owner.firstName} {projects.owner.lastName}
                        </strong>
                      </Link>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <h3>No Results to Display</h3>
              )}
            </Card>
          </Col>
        </Row>
        <Row>
          <Col size="md-6">
            <Card title="List of users">
              {userList.map(user => (
                <ListItem key={user._id}>
                  {user.username}
                </ListItem>
              ))}
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }


export default Test;
