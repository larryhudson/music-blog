import React from 'react'
import Link from 'gatsby-link'
import { navigate } from 'gatsby'
import PreviewCompatibleImage from './PreviewCompatibleImage'

const AlbumCard = ({ album }) => (
	<div className="album"
		key={album.id}
		onClick={() => navigate(album.fields.slug)}
	>
		<div>
			<PreviewCompatibleImage imageInfo={{image: album.frontmatter.image}} />
		</div>
		<div>
			<h2><Link className="has-text-primary" to={album.fields.slug}>{album.frontmatter.title}</Link></h2>
			<p>{album.frontmatter.artist}</p>
			<p><small>{album.frontmatter.blurb}</small></p>
		</div>
	</div>
	)

export default AlbumCard
