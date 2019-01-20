import React from 'react'
import PropTypes from 'prop-types'
import { kebabCase } from 'lodash'
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import PreviewCompatibleImage from '../components/PreviewCompatibleImage'
import Content, { HTMLContent } from '../components/Content'
import SingleAlbum from '../components/SingleAlbum'
import Button from '../components/Button'
import SongList from '../components/SongList'

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

          {/* album cover */}
          <section className="pv3">
            <SingleAlbum title={title} artist={artist} image={image} />
          </section>

          {/* listen links */}
          <section className="pv2">
          	<h4 className="di">Listen:</h4>
            <ul className="di list">
          	{listenLinks.map(link => (
              <li key={link.link + `link`} className="dib mr2">
                  <Button link={link.link} component="a">{link.title}</Button>
              </li>
                ))}
            </ul>
          </section>

            {/* post content */}
            <section className="pv2 lh-copy">
            <p>{blurb}</p>
            <AlbumContent content={content} />
            </section>

            {/* favourite songs */}
            {favouriteSongs && favouriteSongs.length ? (
        			<section className="pv2">
        				<h4>Favourite songs</h4>
        				<SongList>
        				{favouriteSongs.map(song => (
        	                <li key={song.title + `favsong`} className="lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30">
        	                  {song.title}
                            <span className="ml2">
        	                  {song.link.map(songlink => (
                              <Button key={songlink.link + `link`} link={songlink.link} component="a">{songlink.title}</Button>
        	                  	))}
                            </span>
        	                </li>
        	              ))}
        				</SongList>
        			</section>
              ) : null}

            {/* tags */}
            {tags && tags.length ? (
              <section className="pb2 pt4">
                <h4 className="di">Tags</h4>
                <ul className="di list">
                  {tags.map(tag => (
                    <li key={tag + `tag`} className="dib mr2">
                      <Button link={`/tags/${kebabCase(tag)}/`} component="Link">{tag}</Button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
      </section>
  )
}

AlbumTemplate.propTypes = {
  content: PropTypes.object.isRequired,
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
