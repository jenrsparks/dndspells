import React from 'react';
import styled from 'styled-components';

export const color = {
//    artificer: '#73A2FF',
//    barbarian: '#0A5BFA',
    bard: '#E052E0',
    cleric: '#EB4747',
    druid: '#60DF20',
//    fighter: '#FF9595',
//    monk: '#BB6105',
//    mystic:'#DEBD13',
    paladin: '#F5D63D',
    ranger: '#2EA02E',
//    rogue: '#A50F0F',
    sorcerer: '#F2800D',
    warlock: '#A852FF',
    wizard: '#4C88FF'
}


function gradientize(casters) {
    let gradient = '';
    let position = 0;
    let step = 100/casters.length;
    for (let caster of casters) {
        if (position) {
            gradient += ', ';
        }
        gradient += color[caster] + ' ' + position + '% ' + (position += step) + '%';
    }
    return gradient;
}

function AdditionalCaster(props) {

    return (
        <div className={props.className}></div>
    );
}

const StyledAdditionalCaster = styled(AdditionalCaster)`
    position: absolute;
    width: 25%;
    height: 25%;
    border-radius: 50%;
    box-shadow: 0 0 0 0.15rem #222;
    background-color: ${props => color[props.caster]};

    @media screen and (min-width: 1920px) {
        width: 25%;
        height: 25%;
        box-shadow: 0 0 0 0.15vw #222;
    }

    :first-of-type {
        top: 0;
        left: 0;
    }

    :nth-of-type(2) {
        top: 0;
        right: 0;
    }
`;

export const CasterLabel = styled.span`
    color: ${props => color[props.caster]};
    text-transform: capitalize;

    :not(:last-of-type) {
        :after {
            content: ', ';
        }
    }
`;

class SpellTooltip extends React.Component {

    renderCasterLabels(casters) {

        return casters.map(caster => <CasterLabel key={caster} caster={caster}>{caster}</CasterLabel>);
    }

    render() {

        return(
            <div className={this.props.className}>
                <h3>{this.props.name}</h3>
                <h4>{this.props.level ? 'LEVEL ' + this.props.level : 'CANTRIP'}</h4>
                <p>{this.renderCasterLabels(this.props.casters)}{this.props.additionalCasters.length > 0 ? ' and subclasses of ' : ''}{this.renderCasterLabels(this.props.additionalCasters)}</p>
            </div>
        );
    }
}

const StyledSpellTooltip = styled(SpellTooltip)`
    opacity: 0;
    visibility: hidden;
    display: block;
    position: absolute;
    min-width: 10rem;
    top: 115%;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background-color: #111;
    color: #aaa;
    font-size: 0.75rem;
    line-height: 1.3;
    padding: 0.75rem;
    border-radius: 0.5rem;
    transition: box-shadow 0.2s, opacity 0.2s, transform 0.2s;
    box-shadow: 0 0 1rem 0 rgba(0,0,0,0.5);
    z-index: 2;

    :before {
        content: '';
        position: absolute;
        left: calc(50% - 0.5rem);
        top: -0.5rem;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 0.5rem 0.5rem 0.5rem;
        border-color: transparent transparent #111 transparent;
    }

    h3, h4, p {
        margin: 0;
    }

    h3 {
        color: #fff;
        text-transform: uppercase;
        white-space: nowrap;
    }

    h4 {
        border-bottom: 1px solid #333;
        padding-bottom: 0.5rem;
        margin-bottom: 0.5rem;
    }

    p {
        font-family: 'Merriweather', serif;
        line-height: 1.5;
        text-align: left;
    }
`;

/*const renderAdditionalCasters = additionalCasters => additionalCasters ?
    additionalCasters.map(additionalCaster => <StyledAdditionalCaster key={additionalCaster} caster={additionalCaster}/>) :
    '';*/

export class Spell extends React.Component {

    renderAdditionalCasters() {

        return this.props.additionalCastersShown.map(additionalCaster => <StyledAdditionalCaster key={additionalCaster} caster={additionalCaster}/>);
    }

    render() {

        return(
            <StyledSpell {...this.props} className={this.props.className} onClick={() => this.props.onClick()}>
                {this.renderAdditionalCasters(this.props.additionalCastersShown)}
                <SpellLevel></SpellLevel>
                <StyledSpellTooltip name={this.props.name} level={this.props.level} casters={this.props.casters} additionalCasters={this.props.additionalCasters} selected={this.props.selected} />
                <StyledSpellFallback {...this.props} />
            </StyledSpell>
        );
    }
}

const StyledSpellFallback = styled.div.attrs({
    style: props => ({
        background: props.highlightColors.length
            ? 'linear-gradient(' + gradientize(props.highlightColors) + ')'
            : 'linear-gradient(' + gradientize(props.casters) + ')'
    })
})`
    @supports (background: conic-gradient(rgb(76, 136, 255) 0%, rgb(76, 136, 255) 100%)) {
        display: none;
    }

    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    border-radius: 100%;
    ${props => (props.hasOpacity || props.highlightColors.length || props.selected) ? '' : 'opacity: 0.25;'}
    transition: box-shadow 0.2s, opacity 0.2s;
    cursor: pointer;
    z-index: -2;
`;

export const StyledSpell = styled.div.attrs({
    style: props => ({
        background: props.highlightColors.length
            ? 'conic-gradient(' + gradientize(props.highlightColors) + ')'
            : 'conic-gradient(' + gradientize(props.casters) + ')',
        gridColumnStart: props.coordinates[0],
        gridRowStart: props.coordinates[1]
    })
})`
    width: 100%;
    padding-top: 100%;
    border-radius: 50%;
    position: relative;
    ${props => props.selected ? 'box-shadow: 0 0 0 0.1rem #fff;' : ''}
    ${props => props.selected ? 'z-index: 2;' : ''}
    ${props => (props.hasOpacity || props.highlightColors.length || props.selected) ? '' : 'opacity: 0.25;'}
    transition: box-shadow 0.2s, opacity 0.2s;
    cursor: pointer;

    @media screen and (min-width: 1920px) {
        ${props => props.selected ? 'box-shadow: 0 0 0 0.5vh #fff;' : ''}
    }

    :hover {
        ${props => props.selected ? 'box-shadow: 0 0 0 0.2rem #fff;' : 'box-shadow: 0 0 0 0.25vh #222, 0 0 0 0.5vh #fff;'}
        opacity: 1;
        z-index: 2;

        ${StyledSpellTooltip} {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
        }
    }
`;

const SpellLevel = styled.div`
    position: absolute;
    top: calc(50% - 0.75vw);
    left: 0;
    right: 0;
    font-size: 1.5vw;
    line-height: 1.5vw;
    text-align: center;
    color: #222;

    @media only screen and (min-width: 1280px) {
        top: calc(50% - 0.75 * 12.8px);
        font-size: calc(1.5 * 12.8px);
        line-height: calc(1.5 * 12.8px);
    }
`;
