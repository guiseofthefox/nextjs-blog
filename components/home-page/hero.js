import classes from './hero.module.css';
import Image from 'next/image';

function Hero() {
    return (
        <section className={classes.hero}>
            <div className={classes.image}>
                <Image
                    src="/images/site/knox.jpg"
                    alt="An image showing Knox"
                    width={300}
                    height={400}/>
            </div>
            <h1>Hi, I'm Knox</h1>
            <p>
                I blog about being a cat and generalized cat fuckshit.
            </p>
        </section>
    )
}

export default Hero;