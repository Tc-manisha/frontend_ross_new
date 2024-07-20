import React from 'react';
import Layout from './index';
const layoutWrapper = (props, pageName) =>
	{
		return (
			<Layout pageTitle={ pageName } withSidebar={ showSidebar }>
				{ props }
			</Layout>
		);
	};
	export default layoutWrapper;