import React from "react";
import Navbar from "./Navbar";

class Layout extends React.Component<{ children: any }> {
    render() {
        let {children} = this.props;
        return (
            <>
                <Navbar/>
                <main>{children}</main>
            </>
        );
    }
}

export default Layout;
