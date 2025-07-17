import React from 'react';
import Banner from './Banner';
import HowItWorks from './HowItWorks';
import TrustedByThousands from './TrustedByThousands';
import TopScholarship from './TopScholarship';

const Home = () => {
    return (
        <div>
            <Banner />
            <TopScholarship />
            <HowItWorks />
            <TrustedByThousands />
        </div>
    );
};

export default Home;