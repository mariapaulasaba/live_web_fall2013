// =============================================================================
//
// Copyright (c) 2013 Christopher Baker <http://christopherbaker.net>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
// =============================================================================


#include "ofApp.h"


void ofApp::setup()
{
    ofSetFrameRate(30);

    //server
    BasicWebSocketServerSettings settings;
    server = BasicWebSocketServer::makeShared(settings);
    server->getWebSocketRoute()->registerWebSocketEvents(this);
    server->start();
    
    // Launch a browser with the address of the server.
    ofLaunchBrowser(server->getURL());
    
    
    //Drawing
    ofEnableAlphaBlending();
    
}

void ofApp::update()
{

}

//------------------------------------------------------------------------------
void ofApp::draw()
{
    ofBackground(0);
    
    ofPushStyle();
    ofNoFill();
    //for every user, set a color, draw a circle and draw a curve between each pair of users
    for(int i = 0; i < people.size(); i++) {
        ofSetColor(people[i].col);
        ofCircle(people[i].pos.x, people[i].pos.y, 2,2);
       
        ofVec2f p1 = ofVec2f(people[i].pos.x, people[i].pos.y);
        
        for(int j = 0; j < people.size(); j++) {
            ofVec2f p2 = ofVec2f(people[j].pos.x, people[j].pos.y);
            if(i!=j){
            ofVec2f center = ofVec2f(ofGetWidth()/2, ofGetHeight()/2);
            ofVec2f curvy = p2 - center;
            curvy.normalize();
            curvy *= people[i].curvature;
            ofCurve(p1.x, p1.y, p1.x, p1.y, p2.x, p2.y, p1.x+curvy.x, p1.y+curvy.y);
            }
        }
    }

    ofPopStyle();       


}

//------------------------------------------------------------------------------
void ofApp::onWebSocketOpenEvent(WebSocketEventArgs& evt)
{
    cout << "Connection opened from: " << evt.getConnectionRef().getClientAddress().toString() << endl;
    
    //creates a new user, with id, color position and curvature, 
    Person p;
    p.pos = ofVec2f(ofRandom(ofGetWidth()),ofRandom(ofGetHeight()));
    p.curvature = ofRandom(800, 3000);
    p.id = evt.getConnectionRef().getClientAddress().toString();
    p.col = ofColor(ofRandom(255),ofRandom(255),ofRandom(255));
    
    people.push_back(p);
}

//------------------------------------------------------------------------------
void ofApp::onWebSocketCloseEvent(WebSocketEventArgs& evt)
{
    cout << "Connection closed from: " << evt.getConnectionRef().getClientAddress().toString() << endl;
    
    //loop through all users, if it is the one disconnecting, erase the user.
    for(int i = 0; i < people.size(); i++){
        Person p = people[i];
    
        if(p.id == evt.getConnectionRef().getClientAddress().toString()){
            people.erase(people.begin()+i);
        }
    }
}

//------------------------------------------------------------------------------
void ofApp::onWebSocketFrameReceivedEvent(WebSocketFrameEventArgs& evt)
{
    std::string userId = evt.getConnectionRef().getClientAddress().toString();
    std::string rawStringMessage = evt.getFrameRef().getText(); // === e.g. "20,44"
    std:vector<std::string> tokens = ofSplitString(rawStringMessage,",");
    
    //if message has 2 tokens, it means mouse position
    if(tokens.size() == 2)
    {
        float x = ofMap(ofToInt(tokens[0]), 0, 640, 0, ofGetWidth());
        float y = ofMap(ofToInt(tokens[1]), 0, 480, 0, ofGetHeight());
        
        ofVec2f position = ofVec2f(x,y);
        
        for(std::vector<Person>::iterator p = people.begin(); p != people.end(); ++p){
            if ((*p).id == evt.getConnectionRef().getClientAddress().toString()){
                (*p).pos = position;
            }
        }
    }
 
    //else, it means a click
    else if(tokens.size() == 1)
    {
        for(std::vector<Person>::iterator p = people.begin(); p != people.end(); ++p){
            if ((*p).id == evt.getConnectionRef().getClientAddress().toString()){
                (*p).col = ofColor(ofRandom(255),ofRandom(255),ofRandom(255));
                (*p).curvature = ofRandom(800, 3000);

            }
        }
    }
    
    else
    {
        ofLogError("ofApp::onWebSocketFrameReceivedEvent") << "Unable to read message "  << evt.getFrameRef().getText();
    }

}

//------------------------------------------------------------------------------
void ofApp::onWebSocketFrameSentEvent(WebSocketFrameEventArgs& evt)
{
    // frame was sent to clients
}

//------------------------------------------------------------------------------
void ofApp::onWebSocketErrorEvent(WebSocketEventArgs& evt)
{
    cout << "Error from: " << evt.getConnectionRef().getClientAddress().toString() << endl;
}

