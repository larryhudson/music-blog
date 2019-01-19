import React from 'react'
import PropTypes from 'prop-types'
import { kebabCase } from 'lodash'
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import PreviewCompatibleImage from '../components/PreviewCompatibleImage'

export const AlbumTemplate = ({
  content,
  contentComponent,
  blurb,
  tags,
  title,
  helmet,
  image
}) => {
  return (
    <section className="section">
      {helmet || ''}
            <h1>
              {title}
            </h1>
            <PreviewCompatibleImage imageInfo={image} style={{height: '500px', objectFit: 'cover'}} />
            <p>{blurb}</p>
            <div dangerouslySetInnerHTML={{__html: content}} />
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
  content: PropTypes.object.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object,
  image: PropTypes.object
}

const Album = ({ data }) => {
  const { markdownRemark: album } = data

  return (
    <Layout>
      <AlbumTemplate
        content={album.html}
        blurb={album.frontmatter.blurb}
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
        image={album.frontmatter.image}
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
        blurb
        tags
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
