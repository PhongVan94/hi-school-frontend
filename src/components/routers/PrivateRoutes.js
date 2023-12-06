import { Route, Redirect } from 'react-router-dom';
import {useSelector} from "react-redux";

const PrivateRoutes = (props) => {
    const account = useSelector(state => state.user.dataRedux.account);

    const isAuthenticated = useSelector(state => state.user.dataRedux.isAuthenticated);

    if (account
        && isAuthenticated === true
    ) {
        return (
            <>
                <Route path={props.path} component={props.component} />
            </>
        )
    } else {
        return <Redirect to='/login'></Redirect>
    }

}
export default PrivateRoutes;