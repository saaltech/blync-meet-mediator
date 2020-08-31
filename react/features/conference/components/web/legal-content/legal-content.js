/* eslint-disable react/jsx-key */
import React from 'react';


const LegalContent = props =>
    props.content.map(section => (
        <section className = 'legal-document__section'>
            <header className = 'legal-document__section-title'>{section.title}</header>
            <article
                className = { `legal-document__article ${section.article.length > 1
                    ? 'legal-document__article-list' : 'legal-document__article-single'}` }>
                {
                    section.article.map(article => (
                        <div className = 'legal-document__article-section'>
                            {/* {article.content} */}
                            <div dangerouslySetInnerHTML = {{ __html: article.content }} />
                            {article.items && (
                                <p>
                                    {(article.items || []).map(item => (
                                        <div className = 'legal-document__article-item'>
                                            <div className = { `${(item.items || []).length > 0 ? 'bold' : ''} legal-document__article-item-title` }>
                                                <div>{item.title}</div>
                                            </div>
                                            <div dangerouslySetInnerHTML = {{ __html: item.content }} />
                                            <ol className = 'legal-document__sub-item'>
                                                {(item.items || []).map(subItem => <li><div>{subItem}</div></li>)}
                                            </ol>
                                        </div>
                                    ))}
                                </p>
                            )}
                        </div>
                    ))
                }
            </article>
        </section>
    ))
;

export default LegalContent;
