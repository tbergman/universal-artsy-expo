import React from "react"
import { Dimensions, NativeModules } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { MetadataText, SmallHeadline } from "../Components/Inbox/Typography"
import { Schema, Track, track as _track } from "../utils/track"

import colors from "lib/data/colors"
import fonts from "lib/data/fonts"
import styled from "styled-components/native"

import BottomAlignedButton from "../Components/Consignments/Components/BottomAlignedButton"

import ArtworkPreview from "../Components/Inbox/Conversations/Preview/ArtworkPreview"
import ARSwitchBoard from "../NativeModules/SwitchBoard"
import { gravityURL } from "../relay/config"
import { NetworkError } from "../utils/errors"

import { Inquiry_artwork } from "../../__generated__/Inquiry_artwork.graphql"

const isPad = Dimensions.get("window").width > 700

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: white;
`
const Header = styled.View`
  align-self: stretch;
  margin-top: 10;
  flex-direction: column;
  margin-bottom: 30;
`
// This is really rubbish, but I basically have to create an equally sized element
// on the top right, to get the title in the middle
const PlaceholderView = styled(SmallHeadline)`
  padding-right: 20;
  color: white;
`
const TitleView = styled.View`
  align-self: center;
  align-items: center;
  margin-top: 6;
`
const PartnerName = styled(SmallHeadline)`
  font-size: 12;
`
const HeaderTextContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`
const CancelButton = styled.TouchableOpacity`
  padding-left: 20;
`

const Content = styled.View`
  margin-left: 20;
  margin-right: 20;
  align-self: ${isPad ? "center" : "stretch"};
  ${isPad ? "width: 472;" : ""};
`

const InquiryTextInput = styled.TextInput`
  font-size: 16;
  margin-top: 20;
  font-family: ${fonts["garamond-regular"]};
`
const ResponseRate = styled(SmallHeadline)`
  color: ${colors["yellow-bold"]};
  margin-top: 5;
`
// TODO: Uncomment when use is uncommented in code below
// const ResponseIndicator = styled.View`
//   width: 8;
//   height: 8;
//   border-radius: 4;
//   margin-top: 5;
//   margin-right: 5;
//   background-color: ${colors["yellow-bold"]};
// `

const ResponseRateLine = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  min-height: 12;
  margin-top: 5;
`

interface Props {
  artwork: Inquiry_artwork
}

interface State {
  text: string
  sending: boolean
}

const track: Track<Props, State, Schema.Entity> = _track

@track()
export class Inquiry extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      text: this.props.artwork.contact_message,
      sending: false,
    }
  }

  @track(props => ({
    action_type: Schema.ActionTypes.Tap,
    action_name: Schema.ActionNames.InquiryCancel,
    owner_type: Schema.OwnerEntityTypes.Artwork,
    owner_id: props.artwork._id,
    owner_slug: props.artwork.id,
  }))
  cancelModal() {
    this.dismissModal()
  }

  @track(props => ({
    action_type: Schema.ActionTypes.Success,
    action_name: Schema.ActionNames.InquirySend,
    owner_type: Schema.OwnerEntityTypes.Artwork,
    owner_id: props.artwork._id,
    owner_slug: props.artwork.id,
  }))
  inquirySent() {
    this.dismissModal()
  }

  dismissModal() {
    // ARSwitchBoard.dismissModalViewController(this)
  }

  @track(props => ({
    action_type: Schema.ActionTypes.Tap,
    action_name: Schema.ActionNames.InquirySend,
    owner_type: Schema.OwnerEntityTypes.Artwork,
    owner_id: props.artwork._id,
    owner_slug: props.artwork.id,
  }))
  sendInquiry() {
    // Using setState to trigger re-render for the button
    this.setState(() => ({ sending: true }))
    // const { Emission } = NativeModules
    fetch(gravityURL + "/api/v1/me/artwork_inquiry_request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-ACCESS-TOKEN":
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1YjQ1ZGJkNDg4NzU5MTE0ZjgxOWVjMGIiLCJzYWx0X2hhc2giOiJjMDBjMzEwNTdhMzk0NTBkMWU3ODdjYWM5YjRhYmJhMCIsInJvbGVzIjoidXNlciIsInBhcnRuZXJfaWRzIjpbXSwiZXhwIjoxNTM3MDMzMjUxLCJpYXQiOjE1MzE4NDkyNTEsImF1ZCI6IjRlMzZlZmE0ZGI0ZTMyMDAwMTAwMDM1OSIsImlzcyI6IkdyYXZpdHkiLCJqdGkiOiI1YjRlMmEyM2EzZTA2ZTAwMjIzNGZlYTQifQ.M0F4h87JSYJ9fnpki1iVxXPHtpa5FRj3qzxynBIaF1k",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
        "X-USER-ID": "5b45dbd488759114f819ec0b",
      },
      body: JSON.stringify({
        artwork: this.props.artwork.id,
        message: this.state.text,
      }),
    })
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          this.inquirySent()
        } else {
          const error = new NetworkError(response.statusText)
          error.response = response
          this.sendFailed(error)
        }
      })
      .catch(error => {
        this.sendFailed(error)
      })
  }

  @track(props => ({
    action_type: Schema.ActionTypes.Fail,
    action_name: Schema.ActionNames.InquirySend,
    owner_type: Schema.OwnerEntityTypes.Artwork,
    owner_id: props.artwork._id,
    owner_slug: props.artwork.id,
  }))
  sendFailed(error) {
    this.setState(() => ({ sending: false }))
    throw error
  }

  render() {
    const message = this.state.text
    const partnerResponseRate = " " // currently hardcoded for alignment
    const artwork = this.props.artwork
    const partnerName = this.props.artwork.partner.name
    const buttonText = this.state.sending ? "SENDING..." : "SEND"

    const doneButtonStyles = {
      backgroundColor: colors["purple-regular"],
      marginBottom: 0,
      paddingTop: 15,
      height: 50,
    }

    return (
      <Container>
        <BottomAlignedButton
          onPress={this.sendInquiry.bind(this)}
          bodyStyle={doneButtonStyles}
          buttonText={buttonText}
          disabled={this.state.sending}
        >
          <Header>
            <HeaderTextContainer>
              <CancelButton onPress={this.cancelModal.bind(this)}>
                <MetadataText>CANCEL</MetadataText>
              </CancelButton>
              <TitleView>
                <PartnerName>{partnerName}</PartnerName>
                <ResponseRateLine>
                  {/* <ResponseIndicator /> */}
                  <ResponseRate>{partnerResponseRate}</ResponseRate>
                </ResponseRateLine>
              </TitleView>
              <PlaceholderView>CANCEL</PlaceholderView>
            </HeaderTextContainer>
          </Header>
          <Content>
            <ArtworkPreview artwork={artwork as any} />
            <InquiryTextInput
              value={message}
              keyboardAppearance="dark"
              multiline={true}
              autoFocus={typeof jest === "undefined" /* TODO: https://github.com/facebook/jest/issues/3707 */}
              onEndEditing={() => {
                this.setState({ text: null })
              }}
              onChangeText={text => this.setState({ text })}
            />
          </Content>
        </BottomAlignedButton>
      </Container>
    )
  }
}

export default createFragmentContainer(
  Inquiry,
  graphql`
    fragment Inquiry_artwork on Artwork {
      _id
      id
      contact_message
      partner {
        name
      }
      ...ArtworkPreview_artwork
    }
  `
)
