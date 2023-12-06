import {Route, Switch} from "react-router-dom";
import Login from "../Login/Login";
import Home from "../Home/Home";
import React from "react";
import Users from "../ManageUsers/Users";
import Register from "../Register/Register";
import About from "../About/About";
import PrivateRoutes from "./PrivateRoutes";
import GroupRole from "../GroupRole/GroupRole";
import Role from "../Role/Role";
import Group from "../Group/Group";
import Project from "../Project/Project";

const AppRoutes = (props) => {
    return (
        <>
            <Switch>

                <PrivateRoutes path="/users" component={Users}/>
                <PrivateRoutes path="/projects" component={Project} />
                <PrivateRoutes path="/roles" component={Role} />
                <PrivateRoutes path="/groups" component={Group} />
                <PrivateRoutes path="/group-role" component={GroupRole} />


                <Route path="/" exact>
                    <Home/>
                </Route>
                <Route path="/login">
                    <Login/>
                </Route>
                <Route path="/about">
                    <About/>
                </Route>
                <Route path="/register">
                    <Register/>
                </Route>
                <Route path="*">
                    404 Not found
                </Route>
            </Switch>
        </>
    )
}

export default AppRoutes;