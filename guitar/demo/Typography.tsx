import { Heading } from '../src/components/typography';
import { Paper } from '../src/components/misc';

export function Typography() {
	return (
		<>
			<Paper>
				<Heading>This is a h1</Heading>
				<Heading level={2}>This is a h2</Heading>
				<Heading level={3}>This is a h3</Heading>
				<Heading level={4}>This is a h4</Heading>
				<Heading level={5}>This is a h5</Heading>
				<Heading level={6}>This is a h6</Heading>
			</Paper>
			<div style={{ height: 'var(--gui-semantic-space-section-y-large)' }} />
			<p>Below is a Wikipedia article that should showcase typography styles.</p>
			<Paper>
				<Heading>The raven</Heading>
				<p>"<b>The Raven</b>" is a <a href="/wiki/Narrative_poem" className="mw-redirect" title="Narrative poem">narrative poem</a> by American
					writer <a
						href="/wiki/Edgar_Allan_Poe" title="Edgar Allan Poe">Edgar Allan Poe</a>. First published in January 1845, the poem is often noted for
					its
					musicality, stylized language and <a href="/wiki/Supernatural" title="Supernatural">supernatural</a> atmosphere. It tells of a distraught
					lover
					who is paid a visit by a mysterious <a href="/wiki/Common_raven" title="Common raven">raven</a> that repeatedly <a href="/wiki/Talking_bird"
																																	   title="Talking bird">speaks</a> a
					single word. The lover, often identified as a student, is lamenting the loss of his love, Lenore. Sitting on a <a
						href="/wiki/Bust_(sculpture)"
						title="Bust (sculpture)">bust</a> of <a
						href="/wiki/Athena#Pallas_Athena" title="Athena">Pallas</a>, the raven seems to antagonize the protagonist further with its repetition
					of
					the word "<a href="https://en.wiktionary.org/wiki/nevermore" className="extiw" title="wikt:nevermore">nevermore</a>". The poem makes use
					of <a
						href="/wiki/Folklore" title="Folklore">folk</a>, <a href="/wiki/Mythological" className="mw-redirect"
																			title="Mythological">mythological</a>, <a href="/wiki/Religion"
																													  title="Religion">religious</a>, and <a
						href="/wiki/Classical_antiquity" title="Classical antiquity">classical</a> references.
				</p>
				<p>Poe stated that he composed the poem in a logical and methodical manner, aiming to craft a piece that would resonate with both critical and
					popular audiences, as he elaborated in his follow-up essay in 1846, "<a href="/wiki/The_Philosophy_of_Composition"
																							title="The Philosophy of Composition">The Philosophy of
						Composition</a>".
					The poem was inspired in part by a talking raven in the 1841 novel <i><a href="/wiki/Barnaby_Rudge" title="Barnaby Rudge">Barnaby
						Rudge</a></i> by <a href="/wiki/Charles_Dickens" title="Charles Dickens">Charles Dickens</a>. Poe based the
					complex rhythm and <a href="/wiki/Meter_(poetry)" className="mw-redirect" title="Meter (poetry)">meter</a> on <a
						href="/wiki/Elizabeth_Barrett"
						className="mw-redirect"
						title="Elizabeth Barrett">Elizabeth
						Barrett</a>'s poem "Lady Geraldine's Courtship" and made use of <a href="/wiki/Internal_rhyme" title="Internal rhyme">internal
						rhyme</a> as
					well as <a href="/wiki/Alliteration" title="Alliteration">alliteration</a> throughout.
				</p>
				<p>"The Raven" was first attributed to Poe in print in the <i><a href="/wiki/New_York_Evening_Mirror" className="mw-redirect"
																				 title="New York Evening Mirror">New York Evening Mirror</a></i> on January 29,
					1845. Its publication made Poe popular in his lifetime, although it did not bring him much financial success. The poem was soon
					reprinted, <a
						href="/wiki/Parodied" className="mw-redirect" title="Parodied">parodied</a>, and illustrated. Critical opinion is divided as to the
					poem's
					literary status, but it nevertheless remains one of the most famous poems ever written.
				</p>
				<Heading level={2}>Synopsis</Heading>
				{/*put the qoute here*/}
				<p>"The Raven" follows an unnamed narrator on a dreary night in December who sits reading "forgotten lore" by the remains of a fire as a way to
					forget the death of his beloved Lenore. A "tapping at [his] chamber door" reveals nothing, but excites his soul to "burning". The tapping is
					repeated,
					slightly louder, and he realizes it is coming from his window. When he goes to investigate, a raven flutters into his chamber. Paying no
					attention to the man, the raven perches on a <a href="/wiki/Bust_(sculpture)" title="Bust (sculpture)">bust</a> of <a
						href="/wiki/Athena#Pallas_Athena" title="Athena">Pallas</a> above the door.
				</p>
				<Heading level={2}>Analysis</Heading>
				<p>Poe wrote the poem as a narrative, without intentional <a href="/wiki/Allegory" title="Allegory">allegory</a> or <a href="/wiki/Didacticism"
																																	   title="Didacticism">didacticism</a>.
					The main theme of the poem is one of undying devotion. The narrator experiences a <a
						href="/wiki/The_Imp_of_the_Perverse" title="The Imp of the Perverse">perverse conflict</a> between desire to forget and desire to
					remember.
					He
					seems to get some pleasure from focusing on loss. The narrator
					assumes that the word "Nevermore" is the raven's "only stock and store", and, yet, he continues to ask it questions, knowing what the answer
					will be. His questions, then, are purposely self-deprecating and further incite his feelings of loss. Poe leaves it unclear
					whether the raven actually knows what it is saying or whether it really intends to cause a reaction in the poem's narrator. The narrator
					begins
					as "weak
					and weary", becomes regretful and grief-stricken, before passing into a frenzy and, finally, madness. Christopher F. S. Maligec
					suggests the poem is a type of <a href="/wiki/Elegiac" title="Elegiac">elegiac</a> <a href="/wiki/Paraclausithyron" className="mw-redirect"
																										  title="Paraclausithyron">paraclausithyron</a>, an
					ancient
					Greek and Roman poetic form consisting of the lament of an excluded, locked-out lover at the sealed door of his beloved.
				</p>
				<Heading level={3}>Allusions</Heading>
				<p>Poe says that the narrator is a young <a href="/wiki/Student" title="Student">scholar</a>. Though this is not
					explicitly stated in the poem, it is mentioned in "<a href="/wiki/The_Philosophy_of_Composition" title="The Philosophy of Composition">The
						Philosophy of Composition</a>". It is also suggested by the narrator reading books of "lore" as well as by the bust of <a
						href="/wiki/Pallas_Athena" className="mw-redirect" title="Pallas Athena">Pallas Athena</a>, Greek goddess of wisdom.
				</p>
			</Paper>
		</>
	);
}