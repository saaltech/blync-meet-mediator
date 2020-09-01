import React from 'react';

import LegalContent from '../legal-content/legal-content';
import SiteLogo from '../site-logo.svg';

import TermsContent from './content.json';


const TermsOfUse = () => (
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
            <div className = 'terms legal-document'>
                <div className = 'legal-document__title'>
                    <h1>Terms of use - </h1>
                    <span>Version 1.0</span>
                </div>

                <p>
              These terms and conditions (“Terms”) set out the basis upon which (“Users”, “you”, “your”)
              can access and use the website by way of a computer system, mobile device or through an application (“App”)
              (collectively referred to as “Services”) provided by SAAL Operating Systems – Sole Proprietorship LLC (“SAAL” “we”, “us”, “our” and “SAAL”).
                </p>
                <p>
                If you have any questions about SAAL then - in most cases - you will be able to find the answer in these Terms.
                If you cannot find an answer to your query, then please feel free to contact us at the email address specified in the Contact section below.
                </p>
                <LegalContent content = { TermsContent } />
            </div>
        </div>
    </div>
);

export default TermsOfUse;
