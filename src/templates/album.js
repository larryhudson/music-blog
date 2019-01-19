import React from 'react'
import PropTypes from 'prop-types'
import { kebabCase } from 'lodash'
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import PreviewCompatibleImage from '../components/PreviewCompatibleImage'
import Content, { HTMLContent } from '../components/Content'

export const AlbumTemplate = ({
  content,
  contentComponent,
  blurb,
  tags,
  title,
  artist,
  helmet,
  listenLinks,
  favouriteSongs,
  image
}) => {
  const AlbumContent = contentComponent || Content
  return (
    <section className="section">
      {helmet || ''}
            <h1>
              {title}
            </h1>
            <p>{artist}</p>
            <PreviewCompatibleImage imageInfo={{image: image}} style={{height: '500px', objectFit: 'cover'}} />
        	<p>Listen: </p>
        	<ul className="listenlinks">
        	{listenLinks.map(link => (
                <li key={link.link + `link`}>
                  <a href={link.link}>{link.title}</a>
                </li>
              ))}
        	</ul>
            <p>{blurb}</p>
            <AlbumContent content={content} />
            {favouriteSongs && favouriteSongs.length ? (
			<div>
				<h4>Favourite songs</h4>
				<ul className="favouritesongs">
				{favouriteSongs.map(song => (
	                <li key={song.title + `favsong`}>
	                  {song.title}
	                  <ul className="songlinks">
	                  {song.link.map(songlink => (
	                  	<li key={songlink.link + `link`}><a href={songlink.link}>{songlink.title}</a></li>
	                  	))}
	                  </ul>
	                </li>
	              ))}
				</ul>
			</div>
            ) : null}
            {tags && tags.length ? (
              <div style={{ marginTop: `4rem` }}>
                <h4>Tags</h4>
                <ul className="taglist">
                  {tags.map(tag => (
                    <li key={tag + `tag`}>
                      <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
      </section>
  )
}

AlbumTemplate.propTypes = {
  content: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  blurb: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object,
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
}

const Album = ({ data }) => {
  const { markdownRemark: album } = data

  return (
    <Layout>
      <AlbumTemplate
        content={album.html}
        blurb={album.frontmatter.blurb}
        contentComponent={HTMLContent}
        helmet={
          <Helmet
            titleTemplate="%s | Album"
          >
            <title>{`${album.frontmatter.title}`}</title>
            <meta name="description" content={`${album.frontmatter.blurb}`} />
          </Helmet>
        }
        tags={album.frontmatter.tags}
        title={album.frontmatter.title}
        artist={album.frontmatter.artist}
        image={album.frontmatter.image}
        listenLinks={album.frontmatter.listenLinks}
        favouriteSongs={album.frontmatter.favouriteSongs}
      />
    </Layout>
  )
}

Album.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
}

export default Album

export const pageQuery = graphql`
  query AlbumByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        artist
        blurb
        tags
        listenLinks {
        	link
        	title
        }
        favouriteSongs {
        	link {
        		link
        		title
        	}
        	title
        }
        image {
	      id
	      childImageSharp {
	        fluid(maxWidth: 1000) {
	          ...GatsbyImageSharpFluid
	        }
	      }
	    }
      }
    }
  }
`
