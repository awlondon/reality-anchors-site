\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{realityanchors}[2026/01/01 Reality Anchors Institutional Class]

\LoadClass[11pt,a4paper]{article}

% -----------------------------
% Packages
% -----------------------------
\RequirePackage[margin=1in]{geometry}
\RequirePackage{amsmath}
\RequirePackage{amssymb}
\RequirePackage{booktabs}
\RequirePackage{setspace}
\RequirePackage{enumitem}
\RequirePackage{hyperref}
\RequirePackage{fancyhdr}
\RequirePackage{lastpage}
\RequirePackage{draftwatermark}

% -----------------------------
% Global Spacing
% -----------------------------
\onehalfspacing
\setlength{\parskip}{6pt}
\setlength{\parindent}{0pt}

% -----------------------------
% Header / Footer Template
% -----------------------------
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{Reality Anchors}
\fancyhead[R]{Confidential}
\fancyfoot[L]{Enterprise Distribution}
\fancyfoot[R]{Page \thepage\ of \pageref{LastPage}}

% -----------------------------
% Watermark Defaults
% -----------------------------
\SetWatermarkText{CONFIDENTIAL}
\SetWatermarkScale{3}
\SetWatermarkColor[gray]{0.94}

% -----------------------------
% Section Styling
% -----------------------------
\makeatletter
\renewcommand{\section}{\@startsection
  {section}{1}{0mm}
  {-2ex}
  {1ex}
  {\large\bfseries}
}

\renewcommand{\subsection}{\@startsection
  {subsection}{2}{0mm}
  {-1.5ex}
  {0.8ex}
  {\normalsize\bfseries}
}
\makeatother

% -----------------------------
% Custom Commands
% -----------------------------
\newcommand{\RAcover}[4]{
\begin{titlepage}
\centering
\vspace*{4cm}

{\Huge \textbf{Reality Anchors}}\\[1cm]
{\Large #1}\\[2cm]

\begin{tabular}{ll}
Document ID: & #2 \\
Version: & #3 \\
Date: & #4 \\
Classification: & Confidential \\
\end{tabular}

\vfill
Enterprise Distribution
\end{titlepage}
}

\endinput
