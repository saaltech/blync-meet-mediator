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

                <div className = 'legal-document__annex'>
                    <h2>ANNEX 1 - OPEN SOURCE SOFTWARES</h2>

                    <p>
                    You  acknowledge  that  the  Services  contain  third-party  components,  which  are  works  or  materials protected  by
                    third  party  rights.  These  works  or  materials  are,  in  particular,  computer  programs  and graphic  works  in
                    electronic  form,  as  referenced  below.  You  acknowledge  that  the  use  of  third-party components is governed by
                    license arrangements with third parties having rights to  these  third-party components. You hereby acknowledges and
                    confirms that SAAL provided you with license conditions of open-source software used within the Services, and
                    that the you have reviewed and understands those license conditions and agrees that your use of the Services
                    is subject to such content. You acknowledge and agree the third-party components are provided on a "AS IS" BASIS,
                    WITHOUT WARRANTIES OR  CONDITIONS  OF  ANY  KIND,  either  express  or  implied,  including,  without  limitation,  any
                    warranties  or  conditions  of  TITLE,  NON-INFRINGEMENT,  MERCHANTABILITY,  or  FITNESS FOR A PARTICULAR PURPOSE.
                    </p>

                    <p>
                    The following copyright statements and licenses apply to various components that are distributed with the  Services.
                    Services  that  includes  this  file  does  not  necessarily  use  all  of  the  third  party  software components referred to below.
                    </p>

                    <p>
                    You fully agree and comply with these license terms or must not use these components. The third-party license  terms  apply
                    only  to  the  respective  software  to  which  the  license  pertains,  and  the  third  party license terms
                    do not apply to the Services.
                    </p>

                    <p>
                    Insofar as the applicable license terms specify an obligation to publish, the copyright notices and license texts
                    referring to the open source software components used are shown below:
                    </p>

                    <table>
                        <thead>
                            <tr>
                                <th>Components(s)</th>
                                <th>Licensing Information</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Jitsi</td>
                                <td><a href="https://github.com/jitsi/jitsi-meet/blob/master/LICENSE" target="_blank">https://github.com/jitsi/jitsi-meet/blob/master/LICENSE</a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
);

export default TermsOfUse;
