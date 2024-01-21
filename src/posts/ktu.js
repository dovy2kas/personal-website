import React, { useState } from 'react';
import '../styles/blog.scss';
import Navigation from '../components/navigation';
import sqli_payload from './img/sqli_payload.png';
import sqli_result from './img/sqli_result.png';
import contract from './img/contract.png';
import acc_takeover from './img/pass.png';
import acc_takeover_payload from './img/pass_payload.png';
import stored_xss_payload from './img/stored_xss_payload.png';
import stored_xss_result from './img/stored_xss_result.png';
import reflected_xss_result from './img/reflected.png';
import fake_mail_payload from './img/fake_mail_burp.png';
import fake_mail_result from './img/fake_mail_outlook.png'
import ImageModal from '../components/ImageModal';

const KTU = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };
    return (
        <div>
            <Navigation />
            <div className='container break-words px-5 mx-auto mt-5 mb-5'>
                <h1 class='title text-4xl font-semibold mb-5' >How I hacked Kaunas University of Technology</h1>
                <h1 class="sub-title text-4xl font-semibold mb-3 tracking-wide" >Introduction</h1>
                <p class="para font-semibold text-xl tracking-wide">Hello, as you can see in the title, I've found multiple vulnerabilities in the systems of Kaunas University of Technology. To start off, I want to say that at the time of writing all of these vulnerabilities are patched, so don't try this at home :) Let's start from the most critical vulnerability and then work our way down.</p>
                <h1 class="sub-title text-4xl font-semibold mb-3 tracking-wide" >SQL injection</h1>
                <p class="para font-semibold text-xl tracking-wide">Firstly, I've found this url in the dormitory reservation system:</p>
                <br></br>
                <p class="para font-semibold text-xl tracking-wide"> <a href="https://uais.cr.ktu.lt/ktuis/Buitis_rez.Rez_veiksmai?vidko=E8483&veiksmas=IrasytiEile&komanda=Update%20buit_rezervuota%20set%20data_nuo=sysdate,%20bendrab=%2714%27,kambarys=%27413%27,vietos=3,rek_poz=%277%27,rez_tipas=%27K%27,rezervuoti=%271%27,draugas1=%27%27,draugas2=%27%27&bendrab=14&kambarys=413&vietos=3&rek_poz=7&rez_tipas=K&rezervuoti=1&draugas1=&draugas2=" class="url">https://uais.cr.ktu.lt/ktuis/Buitis_rez.Rez_veiksmai?vidko=E8483&veiksmas=IrasytiEile&komanda=Update%20buit_rezervuota%20set%20data_nuo=sysdate,%20bendrab=%2714%27,kambarys=%27413%27,vietos=3,rek_poz=%277%27,rez_tipas=%27K%27,rezervuoti=%271%27,draugas1=%27%27,draugas2=%27%27&bendrab=14&kambarys=413&vietos=3&rek_poz=7&rez_tipas=K&rezervuoti=1&draugas1=&draugas2=</a></p>
                <br></br>
                <p class="para font-semibold text-xl tracking-wide">This url appears when you try to reserve a room at a dormitory. We can take a look at the <span class="highlight">komanda</span> parameter and figure out what statement is being executed. The thing is that we cannot see the result of sql statements directly, it's only showing if the statement successfully executed or what error we got. If we go back to the registration system after visiting this url, we can see, that the only values of <span class="highlight">bendrabutis</span> and <span class="highlight">kambarys</span> are visible. So the next thing I did was to try this payload inside the <span class="highlight">kambarys</span> value: <span class="highlight">||(select user from dual)||</span></p>
                <br></br>
                <p class="para font-semibold text-xl tracking-wide">And I got an error, because the maximum size of the column was 2. I tried to alter the size with this query: <span class="highlight">ALTER TABLE table MODIFY (column VARCHAR2(50))</span></p>
                <p class="para font-semibold text-xl tracking-wide">It looked like it succeeded, but after trying the previous command the maximum size was 6 for some reason. I couldn't figure out why, so I got creative. I ran this payload: <span class="highlight">||(select substr(user, 1, 6) from dual)||</span> which takes the first 6 characters of the result. And of course it worked. Now I was able to see the value when I went back to see the information about the room that I reservated.</p>
                <br></br>
                <p class="para font-semibold text-xl tracking-wide">I tried the same thing with this sql query: <span class="highlight">SELECT COUNT(*) FROM USER_TABLES</span>.</p>
                <button onClick={() => openModal(sqli_payload)}>
                    <img src={sqli_payload} alt="payload" className="mb-2 rounded-lg" />
                </button>
                <button onClick={() => openModal(sqli_result)}>
                    <img src={sqli_result} alt="result" class="mb-2 rounded-lg"></img>
                </button>
                <p class="para font-semibold text-xl tracking-wide">As you can see, the result is 480, which means there are 480 tables in the database. Theoretically, it was possible to even get remote code execution on the server, which would compromise the whole system, but I was unable to achieve that.</p>
                <h1 class="sub-title text-4xl font-semibold mb-3 tracking-wide" >Account takeover</h1>
                <p class="para font-semibold text-xl tracking-wide">This occurs because the server doesn't validate the data sent from the authentication service. When you go to <a href="https://registracija.ktu.lt" class="url">https://registracija.ktu.lt</a> and press forgot login credentials, you can choose to reset the password using electronic government portal or with an email. When you login through the portal, you can alter the personal id number that gets sent back to the KTU servers, changing anyone's password when knowing their personal id number. You can combine this vulnerability with others, which I will be demonstrating later.</p>
                <button onClick={() => openModal(acc_takeover_payload)}>
                    <img src={acc_takeover_payload} alt="Account takeover payload" class="mb-2 l rounded-lg"></img>
                </button>
                <button onClick={() => openModal(acc_takeover)}>
                    <img src={acc_takeover} alt="Account takeover" class="mb-2 rounded-lg"></img>
                </button>
                <h1 class="sub-title text-4xl font-semibold mb-3 tracking-wide" >Study contracts</h1>
                <p class="para font-semibold text-xl tracking-wide">This was pretty simple, when I would go view my study contract, it would load a PDF file inside the website, but if I went to the source itself, I was able to change the id and it would show another student's contract.</p>
                <button onClick={() => openModal(contract)}>
                    <img src={contract} alt="contract" class="mb-2 rounded-lg"></img>
                </button>
                <h1 class="sub-title text-4xl font-semibold mb-3 tracking-wide" >Cross site scripting</h1>
                <p class="para font-semibold text-xl tracking-wide">I've found both stored and reflected XSS. The stored XSS occured in the student contacts page. When you enter data, for example the phone number, after you reload it gets saved in the value of the input. So to escape the value I used this payload <span class="highlight">&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;</span> </p>
                <button onClick={() => openModal(stored_xss_payload)}>
                    <img src={stored_xss_payload} alt="Stored XSS payload" class="mb-2 rounded-lg"></img>
                </button>
                <button onClick={() => openModal(stored_xss_result)}>
                    <img src={stored_xss_result} alt="Stored XSS result" class="mb-2 rounded-lg"></img>
                </button>
                <p class="para font-semibold text-xl tracking-wide">The reflected XSS occured here: <a href="https://uais.cr.ktu.lt/ktuis/TVARKARASTIS.mod_w2?metai=2023&rud_pav=R&p1=1&srch_frag=" class="url">https://uais.cr.ktu.lt/ktuis/TVARKARASTIS.mod_w2?metai=2023&rud_pav=R&p1=1&srch_frag=</a> It works in the same way, but you can create a link that takes you to a fake login page at the real domain.</p>
                <button onClick={() => openModal(reflected_xss_result)}>
                    <img src={reflected_xss_result} alt="Reflected XSS result" class="mb-2 rounded-lg"></img>
                </button>
                <p class="para font-semibold text-xl tracking-wide">Note that this isn't the real login page.</p>
                <h1 class="sub-title text-4xl font-semibold mb-3 tracking-wide" >Email change</h1>
                <p class="para font-semibold text-xl tracking-wide">I've monitored the requests and after you change your personal contacts, you get redirected a link which saves your data. The problem is that it's using GET parameters so you can modify the link, send it to someone, and their email will be changed to yours. You can also force users to change their email with the previous XSS examples, so they don't even know what happened. The vulnerable url was this: <a href="https://uais.cr.ktu.lt/ktuis/vs.studento_adresas_save?svalstybe=Lietuva%26email2=evilmail@gmail.com&sutik1=1" class="url">https://uais.cr.ktu.lt/ktuis/vs.studento_adresas_save?svalstybe=Lietuva%26email2=evilmail@gmail.com&sutik1=1</a></p>
                <h1 class="sub-title text-4xl font-semibold mb-3 tracking-wide" >Fake emails</h1>
                <p class="para font-semibold text-xl tracking-wide">This vulnerability occured in the contact page for companies and it allows us to send multiple emails from any email. The way it works is that if you add a new line and then a dot in the content, it will trick the SMTP server so it thinks that it's a new email being sent. You can combine this vulnerability with XSS or email changes to have a bigger impact.</p>
                <button onClick={() => openModal(fake_mail_payload)}>
                    <img src={fake_mail_payload} alt="Fake mail payload" class="mb-2 rounded-lg"></img>
                </button>
                <button onClick={() => openModal(fake_mail_result)}>
                    <img src={fake_mail_result} alt="Fake mail result" class="mb-2 rounded-lg"></img>
                </button>
                <h1 class="sub-title text-4xl font-semibold mb-3 tracking-wide" >Personal id number leak</h1>
                <p class="para font-semibold text-xl tracking-wide">This vulnerability occured because the server failed to validate the user which is trying to access the info. When you go to this url: <a href="https://uais.cr.ktu.lt/ktuis/Buitis_rez.Parametrai?vidko=&tab_nr=1" class="url">https://uais.cr.ktu.lt/ktuis/Buitis_rez.Parametrai?vidko=&tab_nr=1</a> and type in any student's code, it will show their personal id number.</p>
                <h1 class="sub-title text-4xl font-semibold mb-3 tracking-wide" >Email leak</h1>
                <p class="para font-semibold text-xl tracking-wide">Same as the last one, this time it leaks the user's email at <a href="https://uais.cr.ktu.lt/ktuis/PAZYMA_UZSAKYMAS.UZSAKYTOS?p_vidko=vidko&p_stud_id=id&p_student=1" class="url">https://uais.cr.ktu.lt/ktuis/PAZYMA_UZSAKYMAS.UZSAKYTOS?p_vidko=vidko&p_stud_id=id&p_student=1</a></p>
                <h1 class="sub-title text-4xl font-semibold mb-3 tracking-wide" >Name and surname leak</h1>
                <p class="para font-semibold text-xl tracking-wide">For the last one, it also works the same as the previous. <a href="https://uais.cr.ktu.lt/ktuis/Buitis_rez.COV_Deklaracija?vidko=vidko&kalba=" class="url">https://uais.cr.ktu.lt/ktuis/Buitis_rez.COV_Deklaracija?vidko=vidko&kalba=</a> </p>
                <h1 class="sub-title text-4xl font-semibold mb-3 tracking-wide" >Conclusion</h1>
                <p class="para font-semibold text-xl tracking-wide">The identified vulnerabilities in our university's system could've had far-reaching impact, both on the institution and its members. Every student's personal information could've been leaked, which could result in identity theft. The whole system could've been disrupted for some time until a backup is restored. It's quite concerning why the university's system has so many holes and it raises concerns about the overall security practices in place.</p>
                {selectedImage && (
                    <ImageModal
                        imageUrl={selectedImage}
                        altText="Enlarged"
                        closeModal={closeModal}
                    />
                )}
            </div>
        </div>
    );
};

export default KTU;