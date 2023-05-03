import React from 'react'
import propTypes from 'prop-types'

const Rating = ({ value, text, color }) => {
    return (
        <div className="rating">
            <span>
                <i data-cy="rating-1" style={{ color }} className={
                    value >= 1
                        ?
                        'fas fa-star'
                        : value >= 0.5
                            ? 'fas fa-star-half-alt'
                            : "far fa-star"}>
                </i>
            </span>
            <span>
                <i data-cy="rating-2" style={{ color }}
                    className={
                        value >= 2
                            ?
                            'fas fa-star'
                            : value >= 1.5
                                ? 'fas fa-star-half-alt'
                                : "far fa-star"}>
                </i>
            </span>

            <span>
                <i data-cy="rating-3" style={{ color }}
                    className={
                        value >= 3
                            ?
                            'fas fa-star'
                            : value >= 2.5
                                ? 'fas fa-star-half-alt'
                                : "far fa-star"}>
                </i>
            </span>

            <span>
                <i style={{ color }}
                    data-cy="rating-4"
                    className={
                        value >= 4
                            ?
                            'fas fa-star'
                            : value >= 3.5
                                ? 'fas fa-star-half-alt'
                                : "far fa-star"}>
                </i>
            </span>
            <span>
                <i data-cy="rating-5" style={{ color }}
                    className={
                        value >= 5
                            ?
                            'fas fa-star'
                            : value >= 4.5
                                ? 'fas fa-star-half-alt'
                                : "far fa-star"}>
                </i>
            </span>
            <span>{text && text}</span>
        </div>
    )
}
Rating.defaultProps = {
    color: "#f8e825"
}
Rating.propTypes = {
    value: propTypes.number.isRequired,
    text: propTypes.string.isRequired,
    color: propTypes.string,
}

export default Rating
