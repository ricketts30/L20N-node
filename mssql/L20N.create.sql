-- filename: L20N.create.sql

USE [L20N]
GO
/****** Object:  User [L20NAppender]    Script Date: 20/04/2017 10:08:09 ******/
CREATE USER [L20NAppender] FOR LOGIN [L20NAppender] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  Schema [l20n]    Script Date: 20/04/2017 10:08:10 ******/
CREATE SCHEMA [l20n]
GO
/****** Object:  Table [l20n].[EventCode]    Script Date: 20/04/2017 10:08:10 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [l20n].[EventCode](
	[Code] [int] NOT NULL,
	[IsError] [bit] NOT NULL,
	[Title] [varchar](50) NOT NULL,
 CONSTRAINT [PK_l20n_EventCode] PRIMARY KEY CLUSTERED 
(
	[Code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [l20n].[Events]    Script Date: 20/04/2017 10:08:10 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [l20n].[Events](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [int] NOT NULL,
	[DateUtc] [datetime] NOT NULL,
	[Culture] [nvarchar](10) NULL,
	[Resource] [nvarchar](250) NULL,
	[Error] [nvarchar](1000) NULL,
	[Details] [nvarchar](max) NULL,
 CONSTRAINT [PK_l20n_Events] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  View [l20n].[vw_Event_Details]    Script Date: 20/04/2017 10:08:10 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [l20n].[vw_Event_Details]
AS
SELECT     l20n.EventCode.Code, l20n.EventCode.IsError, l20n.EventCode.Title, l20n.Events.Id, l20n.Events.DateUtc, l20n.Events.Culture, l20n.Events.Resource, 
                      l20n.Events.Error, l20n.Events.Details
FROM         l20n.EventCode INNER JOIN
                      l20n.Events ON l20n.EventCode.Code = l20n.Events.Code


GO
ALTER TABLE [l20n].[Events]  WITH CHECK ADD  CONSTRAINT [FK_l20n_Events_EventCode] FOREIGN KEY([Code])
REFERENCES [l20n].[EventCode] ([Code])
GO
ALTER TABLE [l20n].[Events] CHECK CONSTRAINT [FK_l20n_Events_EventCode]
GO
/****** Object:  StoredProcedure [l20n].[Event_insert]    Script Date: 20/04/2017 10:08:10 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Howard Geraint Ricketts
-- Create date: 19 Apr 2017
-- Description:	Inserts an Event, returns the primary key
-- =============================================
CREATE PROCEDURE [l20n].[Event_insert]
	-- Add the parameters for the stored procedure here
	@Code INT, 
	@DateUtc DATETIME,
	@Culture NVARCHAR(10),
	@Resource NVARCHAR(250),
	@Error NVARCHAR(1000),
	@Details NVARCHAR(MAX),
	@Id INT OUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	INSERT INTO l20n.Events(
		[Code], 
		[DateUtc],
		[Culture],
		[Resource],
		[Error],
		[Details]
	)
	VALUES(
		@Code, 
		@DateUtc,
		@Culture,
		@Resource,
		@Error,
		@Details
	)

	SET @Id = SCOPE_IDENTITY()

END

GO

