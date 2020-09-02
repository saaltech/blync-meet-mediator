import React from 'react';

import LegalContent from '../legal-content/legal-content';
import SiteLogo from '../site-logo.svg';

import PrivacyContent from './content.json';


const Privacy = () => (
    <div
        className = 'page h-100 legal-page'>
        <div className = 'legal-page__container'>
            <a
                className = 'legal-page__logo'
                to = '/'>
                <img
                    alt = 'Site Logo'
                    src = 'static/site-logo.svg' />
            </a>
            <div className = 'privacy legal-document'>
                <div className = 'legal-document__title'>
                    <h1>Privacy Policy - </h1>
                    <span>Version 1.0</span>
                </div>
                <LegalContent content = { PrivacyContent } />
            </div>
        </div>
    </div>
);

export default Privacy;
